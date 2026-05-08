import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CitaEnfermeriaEntity } from '../models/cita-enfermeria/cita-enfermeria'
import { CitaEnfermeriaController } from './cita-enfermeria.controller'
import { CitaEnfermeriaService } from './cita-enfermeria.service'
import { UserEntity } from '../models/user/user'
import { MulterModule } from '@nestjs/platform-express'
import { AuthModule } from 'src/auth/auth.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([CitaEnfermeriaEntity, UserEntity]),
        MulterModule.register({ dest: './uploads' }),
        AuthModule
    ],
    controllers: [CitaEnfermeriaController],
    providers: [CitaEnfermeriaService],
    exports: [CitaEnfermeriaService]
})
export class CitaEnfermeriaModule {}