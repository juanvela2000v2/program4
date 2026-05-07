import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subasta, Pujador } from '../../infrastructure/schemas/subasta.schema';
import { AuctionGateway } from '../../infrastructure/websocket/auction.gateway';
import { AlertasService } from '../alertas/alertas.service';
import { PagosService } from '../pagos/pagos.service';

@Injectable()
export class SubastasService {
  constructor(
    @InjectModel(Subasta.name) private auctionModel: Model<Subasta>,
    @InjectModel(Pujador.name) private bidderModel: Model<Pujador>,
    private auctionGateway: AuctionGateway,
    private alertasService: AlertasService,
    private pagosService: PagosService,
  ) {}

  async listar() {
    return this.auctionModel.find().sort({ createdAt: -1 }).limit(50).lean().exec();
  }

  async listarActivas() {
    return this.auctionModel.find({ estado: 'ACTIVA' }).sort({ fechaFin: 1 }).lean().exec();
  }

  async crear(payload: any) {
    const auction = new this.auctionModel({
      titulo: payload.titulo,
      descripcion: payload.descripcion,
      categoria: payload.categoria,
      imagen: payload.imagen,
      creadorId: payload.creadorId,
      creadorNombre: payload.creadorNombre,
      precioInicial: payload.precioInicial,
      precioActual: payload.precioInicial,
      incrementoMinimo: payload.incrementoMinimo || 1,
      pujadorActualId: '',
      pujadorActualNombre: '',
      fechaFin: new Date(Date.now() + (payload.duracionSegundos || 30) * 1000),
      duracionSegundos: payload.duracionSegundos || 30,
      estado: 'ESPERANDO',
      historialPujas: [],
    });
    return auction.save();
  }

  async findById(id: string) {
    return this.auctionModel.findById(id).lean().exec();
  }

  async iniciarSubasta(id: string) {
    const auction = await this.auctionModel.findById(id).exec();
    if (!auction) throw new Error('Subasta no encontrada');
    
    const duracion = auction.duracionSegundos || 30;
    const fechaFin = new Date(Date.now() + duracion * 1000);
    const updated = await this.auctionModel.findByIdAndUpdate(
      id,
      { estado: 'ACTIVA', fechaFin, duracionSegundos: duracion },
      { new: true }
    ).lean();
    
    this.auctionGateway.broadcastBid({ type: 'SUBASTA_INICIADA', auction: updated });
    setTimeout(() => this.finalizarSubasta(id), duracion * 1000);
    return updated;
  }

  async pujar(subastaId: string, usuarioId: string, usuarioNombre: string, monto: number) {
    const auction = await this.auctionModel.findById(subastaId).exec();
    if (!auction || auction.estado !== 'ACTIVA') {
      throw new Error('Subasta no disponible');
    }
    if (monto <= auction.precioActual) {
      throw new Error('El monto debe ser mayor al precio actual');
    }

    const updated = await this.auctionModel.findByIdAndUpdate(
      subastaId,
      {
        precioActual: monto,
        pujadorActualId: usuarioId,
        pujadorActualNombre: usuarioNombre,
        $push: { historialPujas: `${usuarioNombre}: $${monto}` },
      },
      { new: true }
    ).lean();

    this.auctionGateway.broadcastBid({
      type: 'NUEVA_PUJA',
      precioActual: monto,
      pujadorNombre: usuarioNombre,
      subastaId,
    });

    const remaining = new Date(auction.fechaFin).getTime() - Date.now();
    if (remaining < 10000) {
      await this.auctionModel.findByIdAndUpdate(subastaId, {
        fechaFin: new Date(Date.now() + 10000),
      });
    }
    return updated;
  }

  async finalizarSubasta(subastaId: string) {
    const auction = await this.auctionModel.findById(subastaId).exec();
    if (!auction || auction.estado === 'FINALIZADA') return;

    await this.auctionModel.findByIdAndUpdate(subastaId, { estado: 'FINALIZADA' }).exec();

    const hasWinner = auction.pujadorActualId && auction.pujadorActualNombre;
    
    if (hasWinner) {
      await this.alertasService.crearAlertaAutomatico(
        'Subasta Ganada: ' + auction.titulo,
        'Ganaste la subasta de ' + auction.titulo + ' por $' + auction.precioActual + '. Contacta al vendedor.',
        'URGENTE',
        'ALTA',
        auction.pujadorActualId,
        auction.pujadorActualNombre
      );
      await this.alertasService.crearAlertaAutomatico(
        'Tu articulo se vendio: ' + auction.titulo,
        'Tu artikel ' + auction.titulo + ' se vendio por $' + auction.precioActual + ' a ' + auction.pujadorActualNombre + '.',
        'INFO',
        'MEDIA',
        auction.creadorId,
        auction.creadorNombre
      );
      
      await this.pagosService.crearPagoAutomatico(
        auction.pujadorActualId,
        auction.pujadorActualNombre,
        auction.creadorId,
        auction.creadorNombre,
        auction.precioActual,
        'SUBASTA',
        auction.titulo
      );
    }

    this.auctionGateway.broadcastBid({
      type: 'SUBASTA_FINALIZADA',
      auctionId: subastaId,
      precioFinal: auction.precioActual,
      winnerId: auction.pujadorActualId,
      winnerName: auction.pujadorActualNombre,
    });

    return {
      estado: 'FINALIZADA',
      precioFinal: auction.precioActual,
      winnerId: auction.pujadorActualId,
      winnerName: auction.pujadorActualNombre,
    };
  }
}