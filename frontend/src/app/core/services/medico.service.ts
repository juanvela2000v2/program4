import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from '../../environment'

@Injectable({ providedIn: 'root' })
export class MedicoService {
    http = inject(HttpClient)

    getSalas() {
        return this.http.get<any[]>(`${environment.apiUrl}/medico/salas`, { withCredentials: true })
    }

    getFila() {
        return this.http.get<any[]>(`${environment.apiUrl}/medico/fila`, { withCredentials: true })
    }

    atenderSiguiente(salaId: number) {
        return this.http.post(`${environment.apiUrl}/medico/atender-siguiente`, { salaId }, { withCredentials: true })
    }

    crearDiagnostico(userId: number, data: any) {
    return this.http.post(`${environment.apiUrl}/medico/diagnostico`, { userId, ...data }, { withCredentials: true })
}

crearReceta(data: any) {
    return this.http.post(`${environment.apiUrl}/medico/receta`, data, { withCredentials: true })
}

    getHistorial(ci: string) {
        return this.http.get<any>(`${environment.apiUrl}/medico/historial/${ci}`, { withCredentials: true })
    }
    registrarAlergia(data: any) {
    return this.http.post(`${environment.apiUrl}/medico/alergia`, data, { withCredentials: true })
}

getAlergias(pacienteId: number) {
    return this.http.get<any[]>(`${environment.apiUrl}/medico/alergias/${pacienteId}`, { withCredentials: true })
}
}