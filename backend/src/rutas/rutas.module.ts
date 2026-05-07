import { Module } from '@nestjs/common';
import { RutasController } from './rutas.controller';
import { RutasService } from './rutas.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Reporte } from 'src/reportes/reporte.entity';
import { Ruta } from './ruta.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Ruta]) 
    ],
  controllers: [RutasController],
  providers: [RutasService]
})
export class RutasModule {}
