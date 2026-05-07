import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from 'src/entities/usuario.entity'; // Ruta corregida
import * as bcrypt from 'bcryptjs';

export class CreateUsuarioDto {
  email!: string;
  nombre!: string;
  password!: string;
  rol?: 'ADMIN' | 'CIUDADANO';
  telefono?: string;
}

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  // src/usuario/usuario.service.ts

async crear(createUsuarioDto: CreateUsuarioDto) {
  // 1. Forzamos la extracción para evitar que vengan vacíos
  const { email, nombre, password, rol, telefono } = createUsuarioDto;

  if (!password) {
    throw new Error('El campo "password" es obligatorio');
  }

  const usuarioExistente = await this.usuarioRepository.findOne({
    where: { email },
  });

  if (usuarioExistente) {
    throw new Error('El email ya está registrado');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHasheada = await bcrypt.hash(password, salt);

  // 2. Creamos el objeto manualmente para asegurar que los campos entren
  const nuevoUsuario = this.usuarioRepository.create({
    email,
    nombre,
    password: passwordHasheada,
    rol: rol || 'CIUDADANO',
    telefono
  });

  return await this.usuarioRepository.save(nuevoUsuario);
}

async obtenerPorEmail(email: string) {
  return await this.usuarioRepository.createQueryBuilder('usuario')
    .addSelect('usuario.password') // <--- ESTO permite traer el password aunque esté oculto
    .where('usuario.email = :email', { email })
    .getOne();
}

  async obtenerPorId(id: number) { // Cambiado a number
    return this.usuarioRepository.findOne({
      where: { id },
      relations: ['alertas'],
    });
  }

  async obtenerTodos(rol?: 'ADMIN' | 'CIUDADANO') {
    const query = this.usuarioRepository.createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.alertas', 'alertas');

    if (rol) {
      query.where('usuario.rol = :rol', { rol });
    }

    return await query.getMany();
  }

  async actualizar(id: number, data: any) { // Cambiado a number
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    await this.usuarioRepository.update(id, data);
    return this.obtenerPorId(id);
  }

  async eliminar(id: number) { // Cambiado a number
    return this.usuarioRepository.delete(id);
  }

  async cambiarRol(id: number, nuevoRol: 'ADMIN' | 'CIUDADANO') { // Cambiado a number
    await this.usuarioRepository.update(id, { rol: nuevoRol });
    return this.obtenerPorId(id);
  }
}