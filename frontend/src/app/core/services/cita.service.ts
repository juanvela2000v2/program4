import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from '../../environment'

export interface Especialidad { id: number, nombre: string }

@Injectable({ providedIn: 'root' })
export class CitaService {
    http = inject(HttpClient)

    getEspecialidades() {
        return this.http.get<Especialidad[]>(`${environment.apiUrl}/especialidad`)
    }

    
    getEstadoPorTokenMedica(token: string) {
    return this.http.get<any>(`${environment.apiUrl}/cita-medica/estado/${token}`, { withCredentials: true })
}

    crearCitaEnfermeria(motivo: string, file?: File) {
        const fd = new FormData()
        fd.append('motivo', motivo)
        if (file) fd.append('imagen', file)
        return this.http.post(`${environment.apiUrl}/cita-enfermeria`, fd, { withCredentials: true })
    }

    confirmarPago(token: string) {
        return this.http.put(`${environment.apiUrl}/pagar/${token}`, {})
    }

    getFilaMedica() {
        return this.http.get<any>(`${environment.apiUrl}/cita-medica/fila`, { withCredentials: true })
    }

    getFilaEnfermeria() {
        return this.http.get<any>(`${environment.apiUrl}/cita-enfermeria/fila`, { withCredentials: true })
    }
    getEstadoPorToken(token: string) {
    return this.http.get<any>(`${environment.apiUrl}/cita-medica/estado/${token}`, { withCredentials: true })
}
getEstadoPorTokenEnfermeria(token: string) {
    return this.http.get<any>(`${environment.apiUrl}/cita-enfermeria/estado/${token}`, { withCredentials: true })
}
crearCitaMedica(especialidadId: number, motivo: string) {
    return this.http.post(`${environment.apiUrl}/cita-medica`, { especialidadId, motivo }, { withCredentials: true })
}
}