import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Ubicacion } from '../entities/ubicacion.entity';

@Injectable()
export class UbicacionService {
  constructor(
    @InjectRepository(Ubicacion)
    private readonly repo: Repository<Ubicacion>,
    private readonly events: EventEmitter2,
  ) {}

  async crear(dto: any) {
    const saved = await this.repo.save(this.repo.create(dto));
    this.events.emit('ubicacion.creada', saved);
    return saved;
  }

  async obtenerTodas() {
    return this.repo.find({ relations: ['sensores', 'alertas'] });
  }

  async obtenerPorId(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['sensores', 'alertas'] });
  }

  async obtenerActivas() { return this.repo.find(); }

  async obtenerPorTipo(tipo: string) { return this.repo.find({ where: { tipoArea: tipo } }); }

  async obtenerUbicacionesCercanas(lat: number, lon: number, distancia: number) {
    const todas = await this.repo.find();
    return todas.filter(u => {
      const d = Math.sqrt(Math.pow(+u.latitud - lat, 2) + Math.pow(+u.longitud - lon, 2));
      return d < distancia / 111;
    });
  }

  async actualizar(id: number, data: any) {
    await this.repo.update(id, data);
    return this.obtenerPorId(id);
  }

  async eliminar(id: number) {
    this.events.emit('ubicacion.eliminada', id);
    return this.repo.delete(id);
  }
}