import { Controller, Get, Post, Put, Delete, Param, Body, Req, UseGuards } from '@nestjs/common'
import { EnfermeraService } from './enfermera.service'
import { AuthGuard } from '../auth/auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'
import type { Request } from 'express';
import { DispensacionService } from 'src/dispensacion/dispensacion.service'

@UseGuards(AuthGuard, RolesGuard)
@Roles('enfermera')
@Controller('enfermera')
export class EnfermeraController {
    constructor(private readonly svc: EnfermeraService,private readonly dispensacionSvc: DispensacionService) {}

    @Get('salas')
    getSalas() { return this.svc.getSalas() }

    @Get('fila')
    getFila() { return this.svc.getFilaVirtual() }

    @Post('atender-siguiente')
atenderSiguiente(@Req() req: Request, @Body('salaId') salaId: number) {
    const enfermeraId = (req as any).user.sub
    return this.svc.atenderSiguiente(salaId, enfermeraId)
}

    @Get('almacen')
    getInsumos() { return this.svc.getInsumos() }

    @Post('almacen')
    createInsumo(@Body() body: any) { return this.svc.createInsumo(body) }

    @Put('almacen/:id')
    updateInsumo(@Param('id') id: number, @Body() body: any) { return this.svc.updateInsumo(id, body) }

    @Delete('almacen/:id')
    deleteInsumo(@Param('id') id: number) { return this.svc.deleteInsumo(id) }
    
    @Post('dispensacion')
    crearDispensacion(@Req() req: Request, @Body() body: { pacienteId: number, insumoId: number, cantidad: number, fecha: string }) {
        const enfermeraId = (req as any).user.sub
        return this.dispensacionSvc.dispensar(body.pacienteId, enfermeraId, body.insumoId, body.cantidad, body.fecha)
    }
}