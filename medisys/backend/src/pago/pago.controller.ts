import { Controller, Put, Param } from '@nestjs/common'
import { CitaMedicaService } from '../cita-medica/cita-medica.service'
import { CitaEnfermeriaService } from '../cita-enfermeria/cita-enfermeria.service'

@Controller('pagar')
export class PagoController {
    constructor(
        private readonly citaMedicaSvc: CitaMedicaService,
        private readonly citaEnfermeriaSvc: CitaEnfermeriaService
    ) {}

    @Put(':token')
    async confirmar(@Param('token') token: string) {
        // Intenta ambos; el que tenga el token responderá
        try { return await this.citaMedicaSvc.confirmarPago(token) } catch (e) {}
        try { return await this.citaEnfermeriaSvc.confirmarPago(token) } catch (e) {}
        throw new Error('Token no válido')
    }
}