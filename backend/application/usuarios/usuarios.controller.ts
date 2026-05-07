import { Controller, Get, Post, Body, Put, Delete, Param, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { AuthGuard } from '../../infrastructure/guards/auth.guard';
import { Roles } from '../../infrastructure/decorators/roles.decorator';
import { RolesGuard } from '../../infrastructure/guards/roles.guard';

@Controller('usuarios')
@UseGuards(AuthGuard, RolesGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @Roles('ADMIN')
  listar() {
    return this.usuariosService.listar();
  }

  @Post()
  @Roles('SUPERADMIN')
  crear(@Body() payload: any) {
    return this.usuariosService.crear(payload);
  }

  @Put(':id')
  actualizar(@Req() request: any, @Param('id') id: string, @Body() payload: any) {
    const user = request.user;
    // Solo el propio usuario o admin/superadmin pueden editar
    if (user.sub !== id && !['ADMIN', 'SUPERADMIN'].includes(user.rol)) {
      throw new ForbiddenException('No puedes editar este perfil');
    }
    // Superadmin puede cambiar roles, admin no
    if (user.rol !== 'SUPERADMIN' && payload.rol && payload.rol !== user.rol) {
      throw new ForbiddenException('No puedes cambiar roles');
    }
    return this.usuariosService.actualizar(id, payload);
  }

  @Delete(':id')
  @Roles('SUPERADMIN')
  eliminar(@Param('id') id: string) {
    return this.usuariosService.eliminar(id);
  }
}
