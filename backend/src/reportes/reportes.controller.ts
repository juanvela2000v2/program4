import { Body, Controller, Get, Post } from "@nestjs/common";
import { ReportesService } from "./reportes.service";

@Controller('reportes')
export class ReportesController {

  constructor(private service: ReportesService) {}

  @Post()
  crear(@Body() body: any) {
    return this.service.crear(body);
  }

  @Get()
  listar() {
    return this.service.listar();
  }
}