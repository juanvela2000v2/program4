import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CitaEnfermeriaEntity } from '../models/cita-enfermeria/cita-enfermeria'
import { IsNull, Not, Repository } from 'typeorm'
import { UserEntity } from '../models/user/user'
import { v4 as uuid } from 'uuid'   
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class CitaEnfermeriaService {
    constructor(
        @InjectRepository(CitaEnfermeriaEntity) private repo: Repository<CitaEnfermeriaEntity>,
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>
    ) {}

    async crear(userId: number, motivo: string, imagen?: string) {
        const user = await this.userRepo.findOneBy({ id: userId })
        if (!user) throw new BadRequestException('Usuario no encontrado')

        const cita = this.repo.create({
            id: uuidv4(),
            userId,
            motivo,
            imagen,
            estado: 'pendiente',
            salaId: null,       // ← null
            enfermeraId: null   // ← null
        })

        if (!user.esAsegurado) {
            cita.tokenPago = uuidv4().slice(0, 8)
            cita.estado = 'pendiente'
        } else {
            cita.estado = 'en_espera'
            cita.pagado = true
        }

        return this.repo.save(cita)
    }

    async confirmarPago(token: string) {
        const cita = await this.repo.findOneBy({ tokenPago: token, pagado: false })
        if (!cita) throw new BadRequestException('Token inválido o ya pagado')
        cita.pagado = true
        cita.estado = 'en_espera'
        return this.repo.save(cita)
    }

    async filaVirtual(userId: number) {
    const citaLlamada = await this.repo.findOne({          // ← this.repo, no citaEnfermeriaRepo
        where: { userId, estado: 'atendida', salaId: Not(IsNull()) },
        order: { createdAt: 'DESC' },
        relations: ['sala']
    })

    if (!citaLlamada) {
        return { llamado: false }
    }

    const numero = await this.repo.count({
        where: { estado: 'atendida', salaId: Not(IsNull()) }
    })

    return {
        llamado: true,
        numero,
        sala: citaLlamada.sala?.nombre,
        fecha: citaLlamada.createdAt
    }
}
async getEstadoPorToken(token: string) {
    return this.repo.findOne({ where: { tokenPago: token } })
}
}