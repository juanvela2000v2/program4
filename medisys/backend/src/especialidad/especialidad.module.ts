import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EspecialidadEntity } from '../models/especialidad/especialidad'
import { EspecialidadController } from './especialidad.controller'
import { EspecialidadService } from './especialidad.service'

@Module({
    imports: [TypeOrmModule.forFeature([EspecialidadEntity])],
    controllers: [EspecialidadController],
    providers: [EspecialidadService],
    exports: [EspecialidadService]
})
export class EspecialidadModule {}