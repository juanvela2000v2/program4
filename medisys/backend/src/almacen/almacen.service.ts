import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InsumoEntity } from '../models/insumo/insumo'
import { Repository } from 'typeorm'

@Injectable()
export class AlmacenService {
  constructor(
    @InjectRepository(InsumoEntity)
    private repo: Repository<InsumoEntity>
  ) {}

  async listar() { return this.repo.find() }

  async crear(dto: Partial<InsumoEntity>) {
    const insumo = this.repo.create(dto)
    return this.repo.save(insumo)
  }

  async actualizar(id: number, dto: Partial<InsumoEntity>) {
    await this.repo.update(id, dto)
    return this.repo.findOneBy({ id })
  }

  async eliminar(id: number) {
    return this.repo.delete(id)
  }
}