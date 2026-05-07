import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from '../../infrastructure/schemas/usuario.schema';
import { sign } from 'jsonwebtoken';
import { hashSync, compareSync } from 'bcryptjs';

@Injectable()
export class AutenticacionService {
  constructor(@InjectModel(Usuario.name) private usuarioModel: Model<Usuario>) {}

  async login(email: string, password: string) {
    const usuario = await this.usuarioModel.findOne({ email }).exec();
    if (!usuario || !compareSync(password, usuario.password)) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (usuario.estado !== 'VERIFICADO') {
      throw new UnauthorizedException('Usuario no verificado');
    }

    const payload = {
      sub: usuario._id.toString(),
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      estado: usuario.estado,
      avatar: usuario.avatar,
    };

    const token = sign(payload, process.env.JWT_SECRET || 'CAMBALACHE_SECRET', {
      expiresIn: '12h',
    });

    return {
      accessToken: token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        estado: usuario.estado,
      },
    };
  }

  async register(payload: any) {
    const existing = await this.usuarioModel.findOne({ email: payload.email }).exec();
    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }

    const registro = new this.usuarioModel({
      nombre: payload.nombre,
      email: payload.email,
      password: hashSync(payload.password, 10),
      avatar: payload.avatar || 'https://i.pravatar.cc/150?img=21',
      carnetImagen: payload.carnetImagen || 'sin-imagen',
      fechaNacimiento: payload.fechaNacimiento,
      telefono: payload.telefono,
      direccion: payload.direccion,
      ciudad: payload.ciudad,
      pais: payload.pais,
      descripcion: payload.descripcion,
      estado: 'VERIFICADO',
      rol: 'USER',
      createdAt: new Date(),
    });

    const saved = await registro.save();
    const usuario = saved.toObject();
    delete usuario.password;

    const payloadToken = {
      sub: usuario._id.toString(),
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      estado: usuario.estado,
      avatar: usuario.avatar,
    };

    const token = sign(payloadToken, process.env.JWT_SECRET || 'CAMBALACHE_SECRET', {
      expiresIn: '12h',
    });

    return {
      accessToken: token,
      usuario,
    };
  }

  async me(userId: string) {
    const usuario = await this.usuarioModel.findById(userId).exec();
    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    const userObj = usuario.toObject();
    delete userObj.password;
    return userObj;
  }
}
