import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { AlmacenService } from './almacen.service'
import { AuthGuard } from '../auth/auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'

@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin/almacen')
export class AlmacenController {
  constructor(private readonly svc: AlmacenService) {}

  @Get()
  listar() { return this.svc.listar() }

  @Post()
  crear(@Body() body: any) { return this.svc.crear(body) }

  @Put(':id')
  actualizar(@Param('id') id: number, @Body() body: any) { return this.svc.actualizar(id, body) }

  @Delete(':id')
  eliminar(@Param('id') id: number) { return this.svc.eliminar(id) }
}