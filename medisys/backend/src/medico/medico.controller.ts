import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common'
import { MedicoService } from './medico.service'
import { AuthGuard } from '../auth/auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'
import type { Request } from 'express'
import { AlergiaService } from 'src/alergia/alergia.service'
@UseGuards(AuthGuard, RolesGuard)
@Roles('medico')
@Controller('medico')
export class MedicoController {
    constructor(private readonly svc: MedicoService,private readonly alergiaSvc: AlergiaService) {}

     @Get('salas')
    getSalas() { return this.svc.getSalas() }

    @Get('fila')
    getFila(@Req() req: Request) {
        const medicoId = (req as any).user.sub   // <-- importante
        return this.svc.getFilaVirtual(medicoId)
    }

    @Post('atender-siguiente')
    atenderSiguiente(@Req() req: Request, @Body('salaId') salaId: number) {
        const medicoId = (req as any).user.sub
        return this.svc.atenderSiguiente(salaId, medicoId)
    }

    @Post('diagnostico')
crearDiagnostico(@Req() req: Request, @Body() body: any) {
    const medicoId = (req as any).user.sub
    return this.svc.crearDiagnostico(body.userId, medicoId, body)
}

@Post('receta')
crearReceta(@Req() req: Request, @Body() body: any) {
    const medicoId = (req as any).user.sub
    return this.svc.crearReceta(body.userId, medicoId, body)
}

    @Get('historial/:ci')
    getHistorial(@Param('ci') ci: string) {
        return this.svc.getHistorialPorCI(ci)
    }
    @Post('alergia')
registrarAlergia(@Req() req: Request, @Body() body: any) {
    const medicoId = (req as any).user.sub
    return this.alergiaSvc.registrar({ ...body, medicoId })
}

@Get('alergias/:pacienteId')
getAlergias(@Param('pacienteId') pacienteId: number) {
    return this.alergiaSvc.getPorPaciente(pacienteId)
}
}