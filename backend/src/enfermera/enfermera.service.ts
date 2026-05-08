import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CitaEnfermeriaEntity } from '../models/cita-enfermeria/cita-enfermeria'
import { SalaEntity } from '../models/sala/sala'
import { InsumoEntity } from '../models/insumo/insumo'
import { Repository } from 'typeorm'

@Injectable()
export class EnfermeraService {
    constructor(
        @InjectRepository(CitaEnfermeriaEntity) private citaRepo: Repository<CitaEnfermeriaEntity>,
        @InjectRepository(SalaEntity) private salaRepo: Repository<SalaEntity>,
        @InjectRepository(InsumoEntity) private insumoRepo: Repository<InsumoEntity>
    ) {}

    async getSalas() {
        return this.salaRepo.find()
    }

    async atenderSiguiente(salaId: number, enfermeraId: number) {
    const cita = await this.citaRepo.findOne({
        where: { estado: 'en_espera' } as any,
        order: { createdAt: 'ASC' },
        relations: ['user']
    })
    if (!cita) return null

    cita.estado = 'atendida'
    cita.salaId = salaId
    cita.enfermeraId = enfermeraId
    await this.citaRepo.save(cita)

    return this.citaRepo.findOne({
        where: { id: cita.id },
        relations: ['user', 'sala']
    })
}

    async getFilaVirtual() {
        const fila = await this.citaRepo.find({
            where: { estado: 'en_espera' },
            order: { createdAt: 'ASC' },
            relations: ['user', 'sala']
        })
        return fila
    }
    async getInsumos() {
        return this.insumoRepo.find()
    }

    async createInsumo(data: Partial<InsumoEntity>) {
        const insumo = this.insumoRepo.create(data)
        return this.insumoRepo.save(insumo)
    }

    async updateInsumo(id: number, data: Partial<InsumoEntity>) {
        await this.insumoRepo.update(id, data)
        return this.insumoRepo.findOneBy({ id })
    }

    async deleteInsumo(id: number) {
        return this.insumoRepo.delete(id)
    }
}