import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RutasService {

  private api = 'http://localhost:3000/rutas';

  constructor(
    private http: HttpClient
  ) {}

  // 📋 LISTAR
  listar() {
    return this.http.get<any[]>(this.api);
  }

  // 💾 CREAR
  crear(data: any) {
    return this.http.post(this.api, data);
  }

  // ✏️ EDITAR
  actualizar(id: number, data: any) {
    return this.http.patch(
      `${this.api}/${id}`,
      data
    );
  }

  // ❌ ELIMINAR
  eliminar(id: number) {
    return this.http.delete(
      `${this.api}/${id}`
    );
  }

}