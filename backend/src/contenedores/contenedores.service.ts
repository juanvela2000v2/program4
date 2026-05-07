import { Injectable } from "@nestjs/common";
import { Contenedor } from "./contenedor.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm/browser/repository/Repository.js";

// contenedores.service.ts
@Injectable()
export class ContenedoresService {

  constructor(
    @InjectRepository(Contenedor)
    private repo: Repository<Contenedor>,
  ) {}

  crear(data: Partial<Contenedor>) {
    return this.repo.save(data);
  }

  listar() {
    return this.repo.find();
  }

  actualizar(id: number, data: Partial<Contenedor>) {
    return this.repo.update(id, data);
  }

  eliminar(id: number) {
    return this.repo.delete(id);
  }
}