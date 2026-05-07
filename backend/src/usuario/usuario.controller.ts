import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { UsuarioService, CreateUsuarioDto } from './usuario.service';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

 @Post('registro')
async registro(@Body() createUsuarioDto: any) {
  console.log('DATOS RECIBIDOS EN CONTROLADOR:', createUsuarioDto); // <--- AGREGA ESTO
  return await this.usuarioService.crear(createUsuarioDto);
}

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    const usuario = await this.usuarioService.obtenerPorId(+id);
    if (usuario) {
      const { password, ...resultado } = usuario; // Forma más segura de quitar el password
      return resultado;
    }
    return null;
  }

  @Get()
  async obtenerTodos(@Query('rol') rol?: 'ADMIN' | 'CIUDADANO') {
    const usuarios = await this.usuarioService.obtenerTodos(rol);
    return usuarios.map(u => {
      const { password, ...resultado } = u;
      return resultado;
    });
  }

  @Put(':id')
  async actualizar(@Param('id') id: string, @Body() data: any) {
    return await this.usuarioService.actualizar(+id, data);
  }

  @Put(':id/rol')
  async cambiarRol(
    @Param('id') id: string,
    @Body() data: { nuevoRol: 'ADMIN' | 'CIUDADANO' },
  ) {
    return await this.usuarioService.cambiarRol(+id, data.nuevoRol);
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    return await this.usuarioService.eliminar(+id);
  }
}