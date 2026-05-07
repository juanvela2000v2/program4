import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { AuthGuard } from '../../infrastructure/guards/auth.guard';

@Controller('pagos')
@UseGuards(AuthGuard)
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Get()
  listar(@Req() request: any) {
    return this.pagosService.misPagos(request.user.sub);
  }

  @Get('todos')
  listarTodos() {
    return this.pagosService.listar();
  }

  @Post()
  crear(@Req() request: any, @Body() payload: any) {
    return this.pagosService.crear({
      ...payload,
      usuarioId: request.user.sub,
      usuarioNombre: request.user.nombre,
    });
  }

  @Post(':id/confirmar')
  async confirmar(@Param('id') id: string, @Body() body: { estado: string; notas?: string }) {
    return this.pagosService.actualizarEstado(id, body.estado, body.notas);
  }
}