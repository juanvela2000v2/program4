import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CitaMedicaEntity, EstadoCita } from '../models/cita-medica/cita-medica'
import { IsNull, Not, Repository } from 'typeorm'
import { UserEntity } from '../models/user/user'
import { v4 as uuidv4 } from 'uuid'
@Injectable()
export class CitaMedicaService {
    constructor(
        @InjectRepository(CitaMedicaEntity) private repo: Repository<CitaMedicaEntity>,
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>
    ) {}

    async crear(userId: number, especialidadId: number, motivo: string) {
        const user = await this.userRepo.findOneBy({ id: userId })
        if (!user) throw new BadRequestException('Usuario no encontrado')

        const cita = this.repo.create({
            id: uuidv4(),
            userId,
            especialidadId,
            motivo,
            estado: EstadoCita.PENDIENTE,
            salaId: null,       
            medicoId: null     
        })

        if (!user.esAsegurado) {
            cita.tokenPago = uuidv4().slice(0, 8)
            cita.estado = EstadoCita.PENDIENTE
        } else {
            cita.estado = EstadoCita.EN_ESPERA
            cita.pagado = true
        }

        return this.repo.save(cita)
    }

    async confirmarPago(token: string) {
        const cita = await this.repo.findOneBy({ tokenPago: token, pagado: false })
        if (!cita) throw new BadRequestException('Token inválido o ya pagado')
        cita.pagado = true
        cita.estado = EstadoCita.EN_ESPERA
        return this.repo.save(cita)
    }

    async filaVirtual(userId: number) {
    // Buscar la cita más reciente del usuario que esté atendida y tenga sala asignada
    const citaLlamada = await this.repo.findOne({
        where: { userId, estado: 'atendida', salaId: Not(IsNull()) },
        order: { createdAt: 'DESC' },
        relations: ['especialidad', 'sala']
    })

    if (!citaLlamada) {
        return { llamado: false }
    }

    // Obtener el número de orden (contar cuántas atendidas antes que esta)
    const numero = await this.repo.count({
        where: { estado: 'atendida', salaId: Not(IsNull()) },
        // podrías filtrar por especialidad o simplemente el orden general
    })

    return {
        llamado: true,
        numero, // número global, puedes refinarlo después
        especialidad: citaLlamada.especialidad?.nombre,
        sala: citaLlamada.sala?.nombre,
        fecha: citaLlamada.createdAt
    }
}

    async pasarSiguiente() {
        const primera = await this.repo.findOne({
            where: { estado: EstadoCita.EN_ESPERA },
            order: { createdAt: 'ASC' }
        })
        if (!primera) return null
        primera.estado = EstadoCita.ATENDIDA
        await this.repo.save(primera)
        return primera
    }
    async getEstadoPorToken(token: string) {
    return this.repo.findOne({ where: { tokenPago: token } })
}
}