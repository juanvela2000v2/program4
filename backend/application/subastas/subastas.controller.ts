import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { SubastasService } from './subastas.service';
import { AuthGuard } from '../../infrastructure/guards/auth.guard';

@Controller('subastas')
export class SubastasController {
  constructor(private readonly subastasService: SubastasService) {}

  @Get()
  listar() {
    return this.subastasService.listar();
  }

  @Get('activas')
  listarActivas() {
    return this.subastasService.listarActivas();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.subastasService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  crear(@Req() request: any, @Body() payload: any) {
    return this.subastasService.crear({
      ...payload,
      creadorId: request.user.sub,
      creadorNombre: request.user.nombre,
    });
  }

  @Post(':id/iniciar')
  @UseGuards(AuthGuard)
  iniciar(@Param('id') id: string) {
    return this.subastasService.iniciarSubasta(id);
  }

  @Post(':id/pujar')
  @UseGuards(AuthGuard)
  pujar(
    @Param('id') id: string,
    @Req() request: any,
    @Body() body: { monto: number }
  ) {
    return this.subastasService.pujar(
      id,
      request.user.sub,
      request.user.nombre,
      body.monto
    );
  }
}