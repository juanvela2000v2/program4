import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AlertasService } from './alertas.service';
import { AuthGuard } from '../../infrastructure/guards/auth.guard';
import { Roles } from '../../infrastructure/decorators/roles.decorator';
import { RolesGuard } from '../../infrastructure/guards/roles.guard';

@Controller('alertas')
export class AlertasController {
  constructor(private readonly alertasService: AlertasService) {}

  @Get()
  listar() {
    return this.alertasService.listar();
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  crear(@Body() payload: any) {
    return this.alertasService.crear(payload);
  }
}
