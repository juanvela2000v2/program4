import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AutenticacionService {
  constructor(private readonly api: ApiService) {}

  login(email: string, password: string): Observable<any> {
    return this.api.post('autenticacion/login', { email, password });
  }

  register(payload: any): Observable<any> {
    return this.api.post('autenticacion/register', payload);
  }

  me(token: string): Observable<any> {
    return this.api.get('autenticacion/me', token);
  }

  logout() {
    return this.api.post('autenticacion/logout', {});
  }
}
