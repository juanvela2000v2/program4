import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorService }    from './sensor.service';
import { SensorController } from './sensor.controller';

import { SimuladorService } from './simulador.service';
import { Sensor }    from '../entities/sensor.entity';
import { Ubicacion } from '../entities/ubicacion.entity';
import { Alerta }    from '../entities/alerta.entity';
import { SensorGateway } from './sensor.geteway';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor, Ubicacion, Alerta])],
  controllers: [SensorController],
  providers: [SensorService, SensorGateway, SimuladorService],
  exports: [SensorService],
})
export class SensorModule {}