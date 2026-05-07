import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Reporte } from "./reporte.entity";
import { Repository } from "typeorm/browser/repository/Repository.js";

@Injectable()
export class ReportesService {

  constructor(
    @InjectRepository(Reporte)
    private repo: Repository<Reporte>,
  ) {}

  crear(data: Partial<Reporte>) {
    return this.repo.save(data);
  }

  listar() {
    return this.repo.find();
  }
}