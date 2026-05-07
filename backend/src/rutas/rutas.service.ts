import { Injectable } from '@nestjs/common';
import { Ruta } from './ruta.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/browser/repository/Repository.js';

@Injectable()
export class RutasService {

  constructor(
    @InjectRepository(Ruta)
    private repo: Repository<Ruta>,
  ) {}

  crear(data: Partial<Ruta>) {
    return this.repo.save(data);
  }

  listar() {
    return this.repo.find();
  }
}