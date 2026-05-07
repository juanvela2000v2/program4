import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertaService } from './alerta.service';
import { AlertaController } from './alerta.controller';
import { Alerta } from '../entities/alerta.entity';
import { Ubicacion } from '../entities/ubicacion.entity';
import { ReporteCiudadano } from '../entities/reporte-ciudadano.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Alerta, Ubicacion, ReporteCiudadano])],
  controllers: [AlertaController],
  providers: [AlertaService],
  exports: [AlertaService],
})
export class AlertaModule {}