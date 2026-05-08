import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CitaMedicaEntity } from '../models/cita-medica/cita-medica'
import { DiagnosticoEntity } from '../models/diagnostico/diagnostico'
import { RecetaEntity } from '../models/receta/receta'
import { SalaEntity } from '../models/sala/sala'
import { UserEntity } from '../models/user/user'
import { Repository, FindOptionsWhere } from 'typeorm'
import { AlergiaEntity } from 'src/models/alergia/alergia'

@Injectable()
export class MedicoService {
    constructor(
        @InjectRepository(CitaMedicaEntity) private citaRepo: Repository<CitaMedicaEntity>,
        @InjectRepository(DiagnosticoEntity) private diagRepo: Repository<DiagnosticoEntity>,
        @InjectRepository(RecetaEntity) private recetaRepo: Repository<RecetaEntity>,
        @InjectRepository(SalaEntity) private salaRepo: Repository<SalaEntity>,
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
        @InjectRepository(AlergiaEntity) private alergiaRepo: Repository<AlergiaEntity>
    ) {}

    async getSalas() {
        return this.salaRepo.find()
    }

    async getFilaVirtual(medicoId: number) {
        const medico = await this.userRepo.findOne({ where: { id: medicoId }, relations: ['especialidad'] })
        const whereCond: any = { estado: 'en_espera' }

        if (medico && medico.especialidadId) {
            whereCond.especialidadId = medico.especialidadId
        }


        return this.citaRepo.find({
            where: whereCond,
            order: { createdAt: 'ASC' },
            relations: ['user', 'especialidad', 'sala']
        })
    }

    async atenderSiguiente(salaId: number, medicoId: number) {
        const medico = await this.userRepo.findOne({ where: { id: medicoId }, relations: ['especialidad'] })
        if (!medico) throw new NotFoundException('Médico no encontrado')

        const whereCond: any = { estado: 'en_espera' }
        if (medico.especialidadId) {
            whereCond.especialidadId = medico.especialidadId
        }

        const cita = await this.citaRepo.findOne({
            where: whereCond,
            order: { createdAt: 'ASC' },
            relations: ['user']
        })

        if (!cita) return null

        cita.estado = 'atendida'
        cita.salaId = salaId
        cita.medicoId = medicoId
        await this.citaRepo.save(cita)

        return this.citaRepo.findOne({
            where: { id: cita.id },
            relations: ['user', 'especialidad', 'sala']
        })
    }


    async crearDiagnostico(
    userId: number, medicoId: number,
    dto: {
        motivoConsulta: string,
        sintomas: string,
        evaluacionClinica: string,
        diagnostico: string,
        cie10?: string,
        observaciones?: string,
        fecha?: string
    }
) {
    const diag = this.diagRepo.create({
        userId,
        medicoId,
        fecha: dto.fecha || new Date().toISOString().split('T')[0],
        motivoConsulta: dto.motivoConsulta,
        sintomas: dto.sintomas,
        evaluacionClinica: dto.evaluacionClinica,
        diagnostico: dto.diagnostico,
        cie10: dto.cie10,
        observaciones: dto.observaciones
    })
    return this.diagRepo.save(diag)
}

async crearReceta(
    userId: number, medicoId: number,
    dto: {
        medicamento: string,
        dosis: string,
        frecuencia: string,
        duracion: string,
        instrucciones?: string,
        fecha?: string
    }
) {
    const receta = this.recetaRepo.create({
        userId,
        medicoId,
        fecha: dto.fecha || new Date().toISOString().split('T')[0],
        medicamento: dto.medicamento,
        dosis: dto.dosis,
        frecuencia: dto.frecuencia,
        duracion: dto.duracion,
        instrucciones: dto.instrucciones
    })
    return this.recetaRepo.save(receta)
}

    async getHistorialPorCI(ci: string) {
    const user = await this.userRepo.findOneBy({ ci });
    if (!user) throw new NotFoundException('Paciente no encontrado');

    const diagnosticos = await this.diagRepo.find({
        where: { userId: user.id },
        order: { fecha: 'DESC' },
        relations: ['medico']
    });

    const recetas = await this.recetaRepo.find({
        where: { userId: user.id },
        order: { fecha: 'DESC' },
        relations: ['medico']
    });

    const alergias = await this.alergiaRepo.find({
        where: { pacienteId: user.id },
        order: { createdAt: 'DESC' }
    });

    return { paciente: user, diagnosticos, recetas, alergias };
}
}