import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CitaMedicaEntity } from '../models/cita-medica/cita-medica'
import { CitaMedicaController } from './cita-medica.controller'
import { CitaMedicaService } from './cita-medica.service'
import { UserEntity } from '../models/user/user'
import { AuthModule } from 'src/auth/auth.module'

@Module({
    imports: [TypeOrmModule.forFeature([CitaMedicaEntity, UserEntity]),
    AuthModule
],

    controllers: [CitaMedicaController],
    providers: [CitaMedicaService],
    exports: [CitaMedicaService]
})
export class CitaMedicaModule {}