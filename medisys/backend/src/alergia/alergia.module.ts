import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AlergiaEntity } from '../models/alergia/alergia'
import { AlergiaService } from './alergia.service'

@Module({
    imports: [TypeOrmModule.forFeature([AlergiaEntity])],
    providers: [AlergiaService],
    exports: [AlergiaService]
})
export class AlergiaModule {}