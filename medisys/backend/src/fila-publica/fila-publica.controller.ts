import { Controller, Get } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CitaMedicaEntity } from '../models/cita-medica/cita-medica'
import { CitaEnfermeriaEntity } from '../models/cita-enfermeria/cita-enfermeria'
import { IsNull, Not, Repository } from 'typeorm'

@Controller('fila-publica')
export class FilaPublicaController {
    constructor(
        @InjectRepository(CitaMedicaEntity)
        private citaMedicaRepo: Repository<CitaMedicaEntity>,
        @InjectRepository(CitaEnfermeriaEntity)
        private citaEnfermeriaRepo: Repository<CitaEnfermeriaEntity>
    ) {}

    @Get()
async getFilaPublica() {
    // Buscar todas las citas médicas con estado "atendida" y sala asignada, trayendo la especialidad
    const atendidas = await this.citaMedicaRepo.find({
        where: { estado: 'atendida', salaId: Not(IsNull()) },
        relations: ['user', 'especialidad', 'sala']
    })

    // Agrupar por especialidad (tomamos la más reciente si hay varias)
    const porEspecialidad: any = {}
    atendidas.forEach(cita => {
        const key = cita.especialidad?.id || 'sin-especialidad'
        const fechaActual = cita.createdAt?.getTime() ?? 0
        const fechaGuardada = porEspecialidad[key]?.createdAt?.getTime() ?? 0
        if (!porEspecialidad[key] || fechaActual > fechaGuardada) {
            porEspecialidad[key] = cita
        }
    })

    // Construir array de especialidades con su paciente
    const especialidades = Object.values(porEspecialidad).map((cita: any) => ({
        especialidad: cita.especialidad?.nombre || 'Sin especialidad',
        paciente: `${cita.user?.nombre} ${cita.user?.apellidoPaterno}`,
        sala: cita.sala?.nombre,
        fecha: cita.createdAt
    }))

    // Enfermería (igual que antes)
    const enfermeriaLlamado = await this.citaEnfermeriaRepo.findOne({
        where: { estado: 'atendida', salaId: Not(IsNull()) },
        order: { createdAt: 'DESC' },
        relations: ['user', 'sala']
    })

    const esperaMedica = await this.citaMedicaRepo.count({ where: { estado: 'en_espera' } })
    const esperaEnfermeria = await this.citaEnfermeriaRepo.count({ where: { estado: 'en_espera' } })

    return {
        especialidades,
        enfermeria: enfermeriaLlamado ? {
            paciente: `${enfermeriaLlamado.user?.nombre} ${enfermeriaLlamado.user?.apellidoPaterno}`,
            sala: enfermeriaLlamado.sala?.nombre,
            fecha: enfermeriaLlamado.createdAt
        } : null,
        esperaMedica,
        esperaEnfermeria
    }
}
}