import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  readonly base = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private get H() {
    const t = localStorage.getItem('token');
    return t ? new HttpHeaders({ Authorization: `Bearer ${t}` }) : new HttpHeaders();
  }

  // Alertas
  getAlertasMapa(): Observable<any[]>   { return this.http.get<any[]>(`${this.base}/alertas`); }
  getAlertas(p: any = {}): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/alertas`, { params: p });
  }
  getEstadisticas(): Observable<any>    { return this.http.get(`${this.base}/alertas/estadisticas`); }
  getAlertasPorUbicacion(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/alertas/ubicacion/${id}`);
  }
  crearReporteCiudadano(fd: FormData): Observable<any> {
    return this.http.post(`${this.base}/alertas/ciudadano`, fd);
  }
  resolverAlerta(id: number, nota: string): Observable<any> {
    return this.http.put(`${this.base}/alertas/${id}/resolver`,
      { notaResolucion: nota }, { headers: this.H });
  }
  eliminarAlerta(id: number): Observable<any> {
    return this.http.delete(`${this.base}/alertas/${id}`, { headers: this.H });
  }

  // Sensores
  getHistoricoSensor(horas = 2): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/sensores/historico?horas=${horas}`);
  }
  getSensoresPorUbicacion(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/sensores/ubicacion/${id}`);
  }

  // Ubicaciones
  getUbicaciones(): Observable<any[]>   { return this.http.get<any[]>(`${this.base}/ubicaciones`); }
  getUbicacionById(id: number): Observable<any> { return this.http.get(`${this.base}/ubicaciones/${id}`); }
  crearUbicacion(data: any): Observable<any> {
    return this.http.post(`${this.base}/ubicaciones`, data, { headers: this.H });
  }
  actualizarUbicacion(id: number, data: any): Observable<any> {
    return this.http.put(`${this.base}/ubicaciones/${id}`, data, { headers: this.H });
  }
  eliminarUbicacion(id: number): Observable<any> {
    return this.http.delete(`${this.base}/ubicaciones/${id}`, { headers: this.H });
  }

  // Usuarios
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/usuarios`, { headers: this.H });
  }
  cambiarRol(id: number, nuevoRol: string): Observable<any> {
    return this.http.put(`${this.base}/usuarios/${id}/rol`, { nuevoRol }, { headers: this.H });
  }
  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.base}/usuarios/${id}`, { headers: this.H });
  }
}