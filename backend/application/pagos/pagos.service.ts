import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pago } from '../../infrastructure/schemas/pago.schema';
import { AuctionGateway } from '../../infrastructure/websocket/auction.gateway';

@Injectable()
export class PagosService {
  constructor(
    @InjectModel(Pago.name) private pagoModel: Model<Pago>,
    private auctionGateway: AuctionGateway,
  ) {}

  async listar() {
    return this.pagoModel.find().sort({ createdAt: -1 }).lean().exec();
  }

  async misPagos(usuarioId: string) {
    return this.pagoModel.find({ 
      $or: [{ usuarioId }, { vendedorId: usuarioId }] 
    }).sort({ createdAt: -1 }).lean().exec();
  }

  async crear(payload: any) {
    const pago = new this.pagoModel({
      ...payload,
      estado: 'PENDIENTE',
    });
    const saved = await pago.save();

    this.auctionGateway.broadcastAlerta({
      type: 'PAGO_PENDIENTE',
      pagoId: saved._id,
      titulo: 'Nuevo pago pendiente',
      mensaje: `Pago de $${saved.monto} para ${saved.referenciaTitulo}`,
      monto: saved.monto,
      metodoPago: saved.metodoPago,
      buyerId: saved.usuarioId,
      buyerNombre: saved.usuarioNombre,
    });

    return saved;
  }

  async crearPagoAutomatico(
    usuarioId: string,
    usuarioNombre: string,
    vendedorId: string,
    vendedorNombre: string,
    monto: number,
    referenciaTipo: string,
    referenciaTitulo: string
  ) {
    return this.crear({
      referenciaId: '',
      referenciaTipo,
      referenciaTitulo,
      usuarioId,
      usuarioNombre,
      vendedorId,
      vendedorNombre,
      monto,
      metodoPago: 'EFECTIVO',
    });
  }

  async actualizarEstado(pagoId: string, estado: string, notas?: string) {
    const updated = await this.pagoModel.findByIdAndUpdate(
      pagoId,
      { estado, notas },
      { new: true }
    ).lean();
    return updated;
  }
}