import { Injectable, UnauthorizedException, OnModuleInit } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    const adminEmail = 'admin@gmail.com';
    const existe = await this.usuarioService.obtenerPorEmail(adminEmail);
    
    if (!existe) {
      await this.usuarioService.crear({
        email: adminEmail,
        nombre: 'Administrador Dios',
        password: 'admin123',
        rol: 'ADMIN',
        telefono: '70000000'
      });
    }
  }

  // ESTE ES EL MÉTODO QUE BUSCA TU CONTROLADOR
  async register(datos: any) {
    return await this.usuarioService.crear(datos);
  }

  async login(email: string, pass: string) {
    const usuario = await this.usuarioService.obtenerPorEmail(email);
    if (!usuario) throw new UnauthorizedException('Usuario no encontrado');

    const isMatch = await bcrypt.compare(pass, usuario.password);
    if (!isMatch) throw new UnauthorizedException('Contraseña incorrecta');

    const payload = { sub: usuario.id, email: usuario.email, rol: usuario.rol };
    return {
      access_token: await this.jwtService.signAsync(payload),
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    };
  }
}