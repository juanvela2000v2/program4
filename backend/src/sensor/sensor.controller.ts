import { Controller, Get, Param, Query } from '@nestjs/common';
import { SensorService } from './sensor.service';

@Controller('sensores')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Get('ultimo/:tipo')
  async obtenerUltimo(@Param('tipo') tipo: 'AIRE' | 'AGUA') {
    return await this.sensorService.obtenerUltimoValor(tipo);
  }

  @Get('ubicacion/:ubicacionId')
  async obtenerPorUbicacion(@Param('ubicacionId') ubicacionId: string) {
    return await this.sensorService.obtenerSensoresPorUbicacion(+ubicacionId);
  }

  @Get('historico')
  async obtenerHistorico(@Query('horas') horas: string = '24') {
    return await this.sensorService.obtenerHistoricoSensores(+horas);
  }
}