import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from '../../environment'

@Injectable({ providedIn: 'root' })
export class AdminService {
  http = inject(HttpClient)

  getStats() {
    return this.http.get<any>(`${environment.apiUrl}/admin/stats`, { withCredentials: true })
  }

  getUsers() {
    return this.http.get<any[]>(`${environment.apiUrl}/admin/users`, { withCredentials: true })
  }

  updateUser(id: number, data: any) {
    return this.http.put(`${environment.apiUrl}/admin/users/${id}`, data, { withCredentials: true })
  }

  deleteUser(id: number) {
    return this.http.delete(`${environment.apiUrl}/admin/users/${id}`, { withCredentials: true })
  }

  // Almacén
  getInsumos() {
    return this.http.get<any[]>(`${environment.apiUrl}/admin/almacen`, { withCredentials: true })
  }

  createInsumo(data: any) {
    return this.http.post(`${environment.apiUrl}/admin/almacen`, data, { withCredentials: true })
  }

  updateInsumo(id: number, data: any) {
    return this.http.put(`${environment.apiUrl}/admin/almacen/${id}`, data, { withCredentials: true })
  }

  deleteInsumo(id: number) {
    return this.http.delete(`${environment.apiUrl}/admin/almacen/${id}`, { withCredentials: true })
  }

  // Especialidades (públicas para listar, admin para editar)
  getEspecialidades() {
    return this.http.get<any[]>(`${environment.apiUrl}/especialidad`)
  }

  createEspecialidad(nombre: string) {
    return this.http.post(`${environment.apiUrl}/especialidad`, { nombre }, { withCredentials: true })
  }

  updateEspecialidad(id: number, nombre: string) {
    return this.http.put(`${environment.apiUrl}/especialidad/${id}`, { nombre }, { withCredentials: true })
  }

  deleteEspecialidad(id: number) {
    return this.http.delete(`${environment.apiUrl}/especialidad/${id}`, { withCredentials: true })
  }
}