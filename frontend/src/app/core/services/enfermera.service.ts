import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from '../../environment'

@Injectable({ providedIn: 'root' })
export class EnfermeraService {
    http = inject(HttpClient)

    getSalas() {
        return this.http.get<any[]>(`${environment.apiUrl}/enfermera/salas`, { withCredentials: true })
    }

    getFila() {
        return this.http.get<any[]>(`${environment.apiUrl}/enfermera/fila`, { withCredentials: true })
    }

    atenderSiguiente(salaId: number) {
        return this.http.post(`${environment.apiUrl}/enfermera/atender-siguiente`, { salaId }, { withCredentials: true })
    }

    getInsumos() {
        return this.http.get<any[]>(`${environment.apiUrl}/enfermera/almacen`, { withCredentials: true })
    }

    createInsumo(data: any) {
        return this.http.post(`${environment.apiUrl}/enfermera/almacen`, data, { withCredentials: true })
    }

    updateInsumo(id: number, data: any) {
        return this.http.put(`${environment.apiUrl}/enfermera/almacen/${id}`, data, { withCredentials: true })
    }

    deleteInsumo(id: number) {
        return this.http.delete(`${environment.apiUrl}/enfermera/almacen/${id}`, { withCredentials: true })
    }
    dispensar(pacienteId: number, insumoId: number, cantidad: number, fecha: string) {
    return this.http.post(`${environment.apiUrl}/enfermera/dispensacion`,
        { pacienteId, insumoId, cantidad, fecha },
        { withCredentials: true }
    )
}
    getAlergias(pacienteId: number) {
    return this.http.get<any[]>(`${environment.apiUrl}/medico/alergias/${pacienteId}`, { withCredentials: true })
}
}