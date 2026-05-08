import { Module } from '@nestjs/common'
import { PagoController } from './pago.controller'
import { CitaMedicaModule } from '../cita-medica/cita-medica.module'
import { CitaEnfermeriaModule } from '../cita-enfermeria/cita-enfermeria.module'

@Module({
    imports: [CitaMedicaModule, CitaEnfermeriaModule],
    controllers: [PagoController]
})
export class PagoModule {}