import { Controller, Post, Body, Get, Param, Req, UseGuards } from '@nestjs/common'
import { CitaMedicaService } from './cita-medica.service'
import { AuthGuard } from '../auth/auth.guard'
import type { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('cita-medica')
export class CitaMedicaController {
    constructor(private readonly citaMedicaService: CitaMedicaService) {}

    @Post()
    crear(@Req() req: Request, @Body() body: { especialidadId: number, motivo: string }) {
        const userId = (req as any).user.sub
        return this.citaMedicaService.crear(userId, body.especialidadId, body.motivo)
    }

    @Get('fila')
    fila(@Req() req: Request) {
        const userId = (req as any).user.sub
        return this.citaMedicaService.filaVirtual(userId)
    }

    @Get('estado/:token')
    getEstado(@Param('token') token: string) {
        return this.citaMedicaService.getEstadoPorToken(token)
    }
}