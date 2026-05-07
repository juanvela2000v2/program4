import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ContenedoresService } from "./contenedores.service";

// contenedores.controller.ts
@Controller('contenedores')
export class ContenedoresController {

  constructor(private service: ContenedoresService) {}

  @Post()
  crear(@Body() body: any) {
    return this.service.crear(body);
  }

  @Get()
  listar() {
    return this.service.listar();
  }
@Put(':id')
  actualizar(@Param('id') id: any, @Body() body: any) {
  console.log('ID:', id);
  console.log('BODY:', body);
  return this.service.actualizar(Number(id), body);
}
  @Delete(':id')
  eliminar(@Param('id') id: number) {
    return this.service.eliminar(id);
  }
}