import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from '../../infrastructure/schemas/usuario.schema';
import { hashSync } from 'bcryptjs';

@Injectable()
export class UsuariosService {
  constructor(@InjectModel(Usuario.name) private usuarioModel: Model<Usuario>) {}

  listar() {
    return this.usuarioModel.find().select('-password').exec();
  }

  crear(payload: any) {
    const usuario = new this.usuarioModel({
      ...payload,
      password: payload.password ? hashSync(payload.password, 10) : undefined,
    });
    return usuario.save();
  }

  actualizar(id: string, payload: any) {
    // Si se actualiza password, hashearlo
    if (payload.password) {
      payload.password = hashSync(payload.password, 10);
    }
    return this.usuarioModel.findByIdAndUpdate(id, payload, { new: true }).select('-password').exec();
  }

  eliminar(id: string) {
    return this.usuarioModel.findByIdAndDelete(id).exec();
  }

  async findById(id: string) {
    return this.usuarioModel.findById(id).select('-password').exec();
  }
}
