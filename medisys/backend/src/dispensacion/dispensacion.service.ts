import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DispensacionEntity } from '../models/dispensacion/dispensacion'
import { InsumoEntity } from '../models/insumo/insumo'
import { UserEntity } from '../models/user/user'
import { Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class DispensacionService {
    constructor(
        @InjectRepository(DispensacionEntity) private dispensacionRepo: Repository<DispensacionEntity>,
        @InjectRepository(InsumoEntity) private insumoRepo: Repository<InsumoEntity>,
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>
    ) {}

    async dispensar(pacienteId: number, enfermeraId: number, insumoId: number, cantidad: number, fecha: string) {
        // Validar paciente
        const paciente = await this.userRepo.findOneBy({ id: pacienteId })
        if (!paciente) throw new BadRequestException('Paciente no encontrado')
        if (!paciente.esAsegurado) {
        throw new BadRequestException('El paciente no es asegurado y no puede recibir dispensación')
    }
        // Validar insumo y stock
        const insumo = await this.insumoRepo.findOneBy({ id: insumoId })
        if (!insumo) throw new BadRequestException('Insumo no encontrado')
        if (insumo.cantidad < cantidad) {
            throw new BadRequestException(`Stock insuficiente. Actual: ${insumo.cantidad}`)
        }

        // Descontar del almacén
        insumo.cantidad -= cantidad
        await this.insumoRepo.save(insumo)

        // Registrar dispensación
        const dispensacion = this.dispensacionRepo.create({
            id: uuidv4(),
            pacienteId,
            enfermeraId,
            insumoId,
            cantidad,
            fecha
        })
        return this.dispensacionRepo.save(dispensacion)
    }
}