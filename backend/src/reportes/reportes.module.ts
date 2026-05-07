import { Module } from '@nestjs/common';
import { ReportesController } from './reportes.controller';
import { ReportesService } from './reportes.service';
import { Reporte } from './reporte.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reporte]) 
  ],
  controllers: [ReportesController],
  providers: [ReportesService]
})
export class ReportesModule {}
