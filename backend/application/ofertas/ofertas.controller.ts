import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { OfertasService } from './ofertas.service';
import { AuthGuard } from '../../infrastructure/guards/auth.guard';

@Controller('ofertas')
@UseGuards(AuthGuard)
export class OfertasController {
  constructor(private readonly ofertasService: OfertasService) {}

  @Get()
  listar() {
    return this.ofertasService.listar();
  }

  @Post()
  crear(@Body() payload: any) {
    return this.ofertasService.crear(payload);
  }
}
