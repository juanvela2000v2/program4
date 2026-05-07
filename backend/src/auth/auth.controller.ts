import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth') // Ruta que llamará el frontend
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() datos: any) {
    // Llama al método crear de tu UsuarioService a través de AuthService
    return await this.authService.register(datos);
  }

  @Post('login')
  async login(@Body() credenciales: { email: string; password: string }) {
    return await this.authService.login(credenciales.email, credenciales.password);
  }
}