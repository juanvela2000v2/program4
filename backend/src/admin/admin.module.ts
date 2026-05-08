import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminController } from './admin.controller'
import { CitaMedicaEntity } from '../models/cita-medica/cita-medica'
import { UserEntity } from '../models/user/user'

@Module({
  imports: [TypeOrmModule.forFeature([CitaMedicaEntity, UserEntity])],
  controllers: [AdminController]
})
export class AdminModule {}