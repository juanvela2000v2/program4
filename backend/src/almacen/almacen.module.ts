import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InsumoEntity } from '../models/insumo/insumo'
import { AlmacenController } from './almacen.controller'
import { AlmacenService } from './almacen.service'

@Module({
  imports: [TypeOrmModule.forFeature([InsumoEntity])],
  controllers: [AlmacenController],
  providers: [AlmacenService]
})
export class AlmacenModule {}