import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Servicio } from '../../infrastructure/schemas/servicio.schema';

@Injectable()
export class ServiciosService {
  constructor(@InjectModel(Servicio.name) private servicioModel: Model<Servicio>) {}

  async create(servicioData: any) {
    const servicio = new this.servicioModel(servicioData);
    return servicio.save();
  }

  async findAll() {
    return this.servicioModel.find({ estado: 'ACTIVO' }).exec();
  }

  async findById(id: string) {
    const servicio = await this.servicioModel.findById(id).exec();
    if (!servicio) {
      throw new NotFoundException('Servicio no encontrado');
    }
    return servicio;
  }

  async update(id: string, updateData: any) {
    const servicio = await this.servicioModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!servicio) {
      throw new NotFoundException('Servicio no encontrado');
    }
    return servicio;
  }

  async delete(id: string) {
    const servicio = await this.servicioModel.findByIdAndDelete(id).exec();
    if (!servicio) {
      throw new NotFoundException('Servicio no encontrado');
    }
    return servicio;
  }

  async findByUser(userId: string) {
    return this.servicioModel.find({ usuarioId: userId }).exec();
  }
}