import { Injectable, signal } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class PacienteActualService {
    private paciente = signal<any>(null)

    setPaciente(p: any) {
        this.paciente.set(p)
    }

    getPaciente() {
        return this.paciente()
    }

    limpiar() {
        this.paciente.set(null)
    }
}