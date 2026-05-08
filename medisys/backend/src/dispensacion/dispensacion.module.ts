import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DispensacionEntity } from '../models/dispensacion/dispensacion'
import { InsumoEntity } from '../models/insumo/insumo'
import { UserEntity } from '../models/user/user'
import { DispensacionService } from './dispensacion.service'

@Module({
    imports: [TypeOrmModule.forFeature([DispensacionEntity, InsumoEntity, UserEntity])],
    providers: [DispensacionService],
    exports: [DispensacionService]
})
export class DispensacionModule {}