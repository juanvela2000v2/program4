import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Alerta } from '../../infrastructure/schemas/alerta.schema';
import { AuctionGateway } from '../../infrastructure/websocket/auction.gateway';

@Injectable()
export class AlertasService {
  constructor(
    @InjectModel(Alerta.name) private alertaModel: Model<Alerta>,
    private auctionGateway: AuctionGateway,
  ) {}

  async listar() {
    const alertas = await this.alertaModel.find().sort({ createdAt: -1 }).limit(50).lean().exec();
    return alertas;
  }

  async crear(payload: any) {
    const nuevaAlerta = new this.alertaModel({
      titulo: payload.titulo,
      mensaje: payload.mensaje,
      tipo: payload.tipo || 'INFO',
      urgency: payload.urgency || 'MEDIA',
      activa: true,
      creadorId: payload.creadorId,
      creadorNombre: payload.creadorNombre,
      leidaPor: [],
    });
    const saved = await nuevaAlerta.save();
    
    this.auctionGateway.broadcastAlerta({
      _id: saved._id,
      titulo: saved.titulo,
      mensaje: saved.mensaje,
      tipo: saved.tipo,
      urgency: saved.urgency,
      createdAt: new Date().toISOString(),
      creadorNombre: payload.creadorNombre || 'Admin',
      creadorId: payload.creadorId,
    });
    
    return saved;
  }

  async crearAlertaAutomatico(titulo: string, mensaje: string, tipo: string, urgency: string, creadorId: string, creadorNombre: string) {
    return this.crear({
      titulo,
      mensaje,
      tipo,
      urgency,
      creadorId,
      creadorNombre,
    });
  }

  async marcarLeida(id: string, userId: string) {
    return this.alertaModel.findByIdAndUpdate(
      id,
      { $addToSet: { leidaPor: userId } },
      { new: true }
    ).exec();
  }
}