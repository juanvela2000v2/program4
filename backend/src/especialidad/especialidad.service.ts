import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EspecialidadEntity } from '../models/especialidad/especialidad'
import { Repository } from 'typeorm'

@Injectable()
export class EspecialidadService {
  constructor(
    @InjectRepository(EspecialidadEntity)
    private repo: Repository<EspecialidadEntity>
  ) {}

  async listar() { return this.repo.find() }

  async crear(nombre: string) {
    const esp = this.repo.create({ nombre })
    return this.repo.save(esp)
  }

  async actualizar(id: number, nombre: string) {
    await this.repo.update(id, { nombre })
    return this.repo.findOneBy({ id })
  }

  async eliminar(id: number) {
    return this.repo.delete(id)
  }
}