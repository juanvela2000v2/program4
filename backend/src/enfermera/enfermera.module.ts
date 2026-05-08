import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CitaEnfermeriaEntity } from '../models/cita-enfermeria/cita-enfermeria'
import { SalaEntity } from '../models/sala/sala'
import { InsumoEntity } from '../models/insumo/insumo'
import { EnfermeraController } from './enfermera.controller'
import { EnfermeraService } from './enfermera.service'
import { DispensacionModule } from 'src/dispensacion/dispensacion.module'

@Module({
    imports: [TypeOrmModule.forFeature([CitaEnfermeriaEntity, SalaEntity, InsumoEntity]),DispensacionModule],
    
    controllers: [EnfermeraController],
    providers: [EnfermeraService]
})
export class EnfermeraModule {}