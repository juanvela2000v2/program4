import { Module } from '@nestjs/common';
import { TemperaturaController } from './temperatura.controller';
import { TemperaturaService } from './temperatura.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Temperatura } from './model/temperatura';
import { TemperaturaGateway } from './arduino/temperatura.gateway';
import { SerialService } from './arduino/sensor';

@Module({
  imports:[TypeOrmModule.forFeature([Temperatura])],
  controllers: [TemperaturaController],
  providers: [
    TemperaturaService,
    TemperaturaGateway,
    SerialService
  ]
})
export class TemperaturaModule {}
