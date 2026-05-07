import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ReportesService {

  private api = 'http://localhost:3000/reportes';

  constructor(private http: HttpClient) {}

  crear(data: any) {
    return this.http.post(this.api, data);
  }

  listar() {
    return this.http.get(this.api);
  }
}