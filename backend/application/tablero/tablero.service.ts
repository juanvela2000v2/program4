import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from '../../infrastructure/schemas/usuario.schema';
import { Producto } from '../../infrastructure/schemas/producto.schema';
import { Subasta } from '../../infrastructure/schemas/subasta.schema';
import { Pago } from '../../infrastructure/schemas/pago.schema';

@Injectable()
export class TableroService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
    @InjectModel(Producto.name) private productoModel: Model<Producto>,
    @InjectModel(Subasta.name) private subastaModel: Model<Subasta>,
    @InjectModel(Pago.name) private pagoModel: Model<Pago>,
  ) {}

  async obtenerIndicadores() {
    const usuarios = await this.usuarioModel.countDocuments().exec();
    const ventas = await this.productoModel.countDocuments({ estado: 'VENDIDO' }).exec();
    const subastas = await this.subastaModel.countDocuments({ estado: 'ACTIVA' }).exec();
    const ingresos = await this.pagoModel
      .aggregate([
        { $match: { estado: 'VALIDADO' } },
        { $group: { _id: null, total: { $sum: '$monto' } } },
      ])
      .exec();

    return {
      usuarios,
      ventas,
      subastas,
      ingresos: ingresos[0]?.total ?? 0,
    };
  }
}
