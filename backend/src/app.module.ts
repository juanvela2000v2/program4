import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { configDB } from './config/configDataBase'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { UserEntity } from './models/user/user'
import { EspecialidadModule } from './especialidad/especialidad.module'
import { CitaMedicaModule } from './cita-medica/cita-medica.module'
import { CitaEnfermeriaModule } from './cita-enfermeria/cita-enfermeria.module'
import { PagoModule } from './pago/pago.module'
import { EspecialidadEntity } from './models/especialidad/especialidad'
import { CitaMedicaEntity } from './models/cita-medica/cita-medica'
import { CitaEnfermeriaEntity } from './models/cita-enfermeria/cita-enfermeria'
import { AlmacenModule } from './almacen/almacen.module'
import { InsumoEntity } from './models/insumo/insumo'
import { AdminModule } from './admin/admin.module'
import { EnfermeraModule } from './enfermera/enfermera.module'
import { SalaEntity } from './models/sala/sala'
import { MedicoModule } from './medico/medico.module'
import { RecetaEntity } from './models/receta/receta'
import { DiagnosticoEntity } from './models/diagnostico/diagnostico'
import { DispensacionEntity } from './models/dispensacion/dispensacion'
import { AlergiaEntity } from './models/alergia/alergia'
import { AlergiaModule } from './alergia/alergia.module'
import { FilaPublicaModule } from './fila-publica/fila-publica.module'
import { AseguradoEntity } from './models/asegurado/asegurado'
@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
            ...configDB,
            entities: [
                UserEntity,
                EspecialidadEntity,
                CitaMedicaEntity,
                CitaEnfermeriaEntity,InsumoEntity,SalaEntity,DiagnosticoEntity, RecetaEntity,DispensacionEntity,
                AlergiaEntity, AseguradoEntity 
            ],
        }),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET || 'medisys_secreto',
            signOptions: { expiresIn: '24h' },
        }),
        AuthModule,
        UsersModule,
        EspecialidadModule,
        CitaMedicaModule,
        CitaEnfermeriaModule,
        PagoModule,
        AdminModule,
    AlmacenModule,
    EnfermeraModule,
    MedicoModule,
    AlergiaModule,FilaPublicaModule
    ],
})
export class AppModule {}