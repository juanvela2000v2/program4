import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

// contenedores.service.ts
@Injectable({ providedIn: 'root' })
export class ContenedoresService {

  private api = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get(`${this.api}/contenedores`);
  }

  crear(data: any) {
    return this.http.post(`${this.api}/contenedores`, data);
  }
   actualizar(id: number, data: any) {
  return this.http.put(
    `http://localhost:3000/contenedores/${id}`,
    data
  );
}

  // ❌ ELIMINAR
  eliminar(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }

}