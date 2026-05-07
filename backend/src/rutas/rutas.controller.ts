import { Body, Controller, Get, Post } from '@nestjs/common';
import { RutasService } from './rutas.service';

@Controller('rutas')
export class RutasController {

  constructor(private service: RutasService) {}

  @Post()
  crear(@Body() body: any) {
    return this.service.crear(body);
  }

  @Get()
  listar() {
    return this.service.listar();
  }
}