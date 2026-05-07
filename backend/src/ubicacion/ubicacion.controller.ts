import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { UbicacionService } from './ubicacion.service';

@Controller('ubicaciones')
export class UbicacionController {
  constructor(private readonly ubicacionService: UbicacionService) {}

  @Get()
  async obtenerTodas() {
    return await this.ubicacionService.obtenerTodas();
  }

  @Get('activas')
  async obtenerActivas() {
    return await this.ubicacionService.obtenerActivas();
  }

  @Get('tipo/:tipo')
  async obtenerPorTipo(
    @Param('tipo') tipo: 'URBANA' | 'INDUSTRIAL' | 'MINERIA' | 'RURAL',
  ) {
    return await this.ubicacionService.obtenerPorTipo(tipo);
  }

  @Get('cercanas')
  async obtenerCercanas(
    @Query('lat') lat: string,
    @Query('lon') lon: string,
    @Query('distancia') distancia: string = '5',
  ) {
    return await this.ubicacionService.obtenerUbicacionesCercanas(+lat, +lon, +distancia);
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    return await this.ubicacionService.obtenerPorId(+id);
  }

@Post()
async crear(@Body() createUbicacionDto: any) { // Cambiamos temporalmente a any
    console.log('DATOS RECIBIDOS EN CONTROLADOR UBICACIÓN:', createUbicacionDto);
    return await this.ubicacionService.crear(createUbicacionDto);
}

  @Put(':id')
  async actualizar(@Param('id') id: string, @Body() data: any) {
    return await this.ubicacionService.actualizar(+id, data);
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    return await this.ubicacionService.eliminar(+id);
  }
}