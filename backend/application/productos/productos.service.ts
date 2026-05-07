import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Producto } from '../../infrastructure/schemas/producto.schema';
import { Usuario } from '../../infrastructure/schemas/usuario.schema';

@Injectable()
export class ProductosService {
  constructor(
    @InjectModel(Producto.name) private productoModel: Model<Producto>,
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
  ) {}

  async listar() {
    const productos = await this.productoModel.find().lean().exec();
    const usuarioIds = [...new Set(productos.map(p => p.usuarioId).filter(Boolean))];
    const usuarios = await this.usuarioModel.find({ _id: { $in: usuarioIds } }).select('nombre avatar').lean().exec();
    const usuarioMap = new Map(usuarios.map(u => [u._id.toString(), u]));
    
    return productos.map(p => ({
      ...p,
      vendedorNombre: usuarioMap.get(p.usuarioId)?.nombre || p.vendedorNombre,
      vendedorAvatar: usuarioMap.get(p.usuarioId)?.avatar || p.vendedorAvatar,
    }));
  }

  crear(payload: any) {
    const producto = new this.productoModel(payload);
    return producto.save();
  }

  async findById(id: string) {
    const producto = await this.productoModel.findById(id).exec();
    if (producto && producto.usuarioId) {
      const vendedor = await this.usuarioModel.findById(producto.usuarioId).select('nombre avatar email').exec();
      if (vendedor) {
        return {
          ...producto.toObject(),
          vendedor: {
            _id: vendedor._id,
            nombre: vendedor.nombre,
            avatar: vendedor.avatar,
            email: vendedor.email,
          },
        };
      }
    }
    return producto;
  }

  actualizar(id: string, payload: any) {
    return this.productoModel.findByIdAndUpdate(id, payload, { new: true }).exec();
  }

  eliminar(id: string) {
    return this.productoModel.findByIdAndDelete(id).exec();
  }
}
