import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { EspecialidadService } from './especialidad.service'
import { AuthGuard } from '../auth/auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'

@Controller('especialidad')
export class EspecialidadController {
  constructor(private readonly svc: EspecialidadService) {}

  @Get()
  listar() { return this.svc.listar() }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  crear(@Body('nombre') nombre: string) { return this.svc.crear(nombre) }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  actualizar(@Param('id') id: number, @Body('nombre') nombre: string) { return this.svc.actualizar(id, nombre) }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  eliminar(@Param('id') id: number) { return this.svc.eliminar(id) }
}