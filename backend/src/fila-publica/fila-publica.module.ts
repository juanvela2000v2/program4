import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CitaMedicaEntity } from '../models/cita-medica/cita-medica'
import { CitaEnfermeriaEntity } from '../models/cita-enfermeria/cita-enfermeria'
import { FilaPublicaController } from './fila-publica.controller'

@Module({
    imports: [TypeOrmModule.forFeature([CitaMedicaEntity, CitaEnfermeriaEntity])],
    controllers: [FilaPublicaController]
})
export class FilaPublicaModule {}