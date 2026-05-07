import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, Mensaje } from '../../infrastructure/schemas/chat.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(Mensaje.name) private mensajeModel: Model<Mensaje>,
  ) {}

  async buscarOcrear(productoId: string, vendedorId: string, vendedorNombre: string, compradorId: string, compradorNombre: string, productoTitulo: string) {
    let chat = await this.chatModel.findOne({
      productoId,
      compradorId,
      estado: { $ne: 'CERRADO' },
    }).exec();

    if (!chat) {
      chat = new this.chatModel({
        productoId,
        productoTitulo,
        vendedorId,
        vendedorNombre,
        compradorId,
        compradorNombre,
        estado: 'ACTIVO',
      });
      await chat.save();
    }

    return chat;
  }

  async findById(chatId: string) {
    return this.chatModel.findById(chatId).exec();
  }

  async misChats(usuarioId: string) {
    return this.chatModel.find({
      $or: [{ vendedorId: usuarioId }, { compradorId: usuarioId }],
      estado: { $ne: 'CERRADO' },
    }).sort({ updatedAt: -1 }).exec();
  }

  async addMessage(chatId: string, emisorId: string, emisorNombre: string, contenido: string) {
    const mensaje = new this.mensajeModel({
      chatId,
      emisorId,
      emisorNombre,
      contenido,
      leido: false,
    });
    await mensaje.save();

    await this.chatModel.findByIdAndUpdate(chatId, { updatedAt: new Date() });

    return mensaje;
  }

  async getMessages(chatId: string) {
    return this.mensajeModel.find({ chatId }).sort({ createdAt: 1 }).lean().exec();
  }

  async marcarLeido(chatId: string, usuarioId: string) {
    return this.mensajeModel.updateMany(
      { chatId, emisorId: { $ne: usuarioId }, leido: false },
      { $set: { leido: true } }
    ).exec();
  }
}