import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AlergiaEntity } from '../models/alergia/alergia'
import { Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class AlergiaService {
    constructor(
        @InjectRepository(AlergiaEntity) private alergiaRepo: Repository<AlergiaEntity>
    ) {}

    async registrar(dto: {
        pacienteId: number,
        medicoId: number,
        agente: string,
        tipoReaccion: string,
        severidad: string,
        estatus: string,
        fuente: string
    }) {
        const alergia = this.alergiaRepo.create({ ...dto, id: uuidv4() })
        return this.alergiaRepo.save(alergia)
    }

    async getPorPaciente(pacienteId: number) {
        return this.alergiaRepo.find({
            where: { pacienteId },
            order: { createdAt: 'DESC' }
        })
    }
}