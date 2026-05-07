import { Controller, Get, UseGuards } from '@nestjs/common';
import { TableroService } from './tablero.service';
import { AuthGuard } from '../../infrastructure/guards/auth.guard';
import { Roles } from '../../infrastructure/decorators/roles.decorator';
import { RolesGuard } from '../../infrastructure/guards/roles.guard';

@Controller('tablero')
@UseGuards(AuthGuard, RolesGuard)
export class TableroController {
  constructor(private readonly tableroService: TableroService) {}

  @Get()
  @Roles('ADMIN')
  indicadores() {
    return this.tableroService.obtenerIndicadores();
  }
}
