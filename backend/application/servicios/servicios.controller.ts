import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { AuthGuard } from '../../infrastructure/guards/auth.guard';
import { RolesGuard } from '../../infrastructure/guards/roles.guard';
import { Roles } from '../../infrastructure/decorators/roles.decorator';

@Controller('servicios')
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() body: any, @Req() request: any) {
    const servicioData = {
      ...body,
      usuarioId: request.user.sub,
      proveedorNombre: request.user.nombre,
      proveedorAvatar: request.user.avatar,
    };
    return this.serviciosService.create(servicioData);
  }

  @Get()
  findAll() {
    return this.serviciosService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.serviciosService.findById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() body: any, @Req() request: any) {
    // Solo el propietario puede editar
    return this.serviciosService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  delete(@Param('id') id: string) {
    return this.serviciosService.delete(id);
  }

  @Get('usuario/:userId')
  @UseGuards(AuthGuard)
  findByUser(@Param('userId') userId: string, @Req() request: any) {
    // Solo el propio usuario o admin
    if (request.user.sub !== userId && !['ADMIN', 'SUPERADMIN'].includes(request.user.rol)) {
      throw new Error('No autorizado');
    }
    return this.serviciosService.findByUser(userId);
  }
}