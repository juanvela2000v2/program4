import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CitaMedicaEntity } from '../models/cita-medica/cita-medica'
import { DiagnosticoEntity } from '../models/diagnostico/diagnostico'
import { RecetaEntity } from '../models/receta/receta'
import { SalaEntity } from '../models/sala/sala'
import { UserEntity } from '../models/user/user'
import { MedicoController } from './medico.controller'
import { MedicoService } from './medico.service'
import { AlergiaModule } from 'src/alergia/alergia.module'
import { AlergiaEntity } from 'src/models/alergia/alergia'

@Module({
    imports: [TypeOrmModule.forFeature([CitaMedicaEntity, DiagnosticoEntity, RecetaEntity, SalaEntity, UserEntity,AlergiaEntity ]),AlergiaModule],
    controllers: [MedicoController],
    providers: [MedicoService]
})
export class MedicoModule {}