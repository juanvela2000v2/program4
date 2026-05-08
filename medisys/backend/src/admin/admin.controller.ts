import { Controller, Get, UseGuards } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CitaMedicaEntity } from '../models/cita-medica/cita-medica'
import { UserEntity } from '../models/user/user'
import { Repository } from 'typeorm'
import { AuthGuard } from '../auth/auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'

@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin/stats')
export class AdminController {
  constructor(
    @InjectRepository(CitaMedicaEntity) private citaMedicaRepo: Repository<CitaMedicaEntity>,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>
  ) {}

  @Get()
  async getStats() {
    const totalUsuarios = await this.userRepo.count()
    const totalMedicos = await this.userRepo.countBy({ rol: 'medico' as any })
    const totalEnfermeras = await this.userRepo.countBy({ rol: 'enfermera' as any })

    const citasPorEspecialidad = await this.citaMedicaRepo
      .createQueryBuilder('cita')
      .leftJoin('cita.especialidad', 'esp')
      .select('esp.nombre', 'nombre')
      .addSelect('COUNT(cita.id)', 'cantidad')
      .groupBy('esp.nombre')
      .getRawMany()

    return {
      totalUsuarios,
      totalMedicos,
      totalEnfermeras,
      citasPorEspecialidad
    }
  }
}