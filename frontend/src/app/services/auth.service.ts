import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Tu backend usa @Controller('auth') + setGlobalPrefix('api') → /api/auth
  private readonly API = 'http://localhost:3000/api/auth';

  private _user = new BehaviorSubject<any>(this.usuarioGuardado);
  user$ = this._user.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private get usuarioGuardado() {
    try { return JSON.parse(localStorage.getItem('usuario') || 'null'); }
    catch { return null; }
  }

  get currentUser() { return this._user.value; }

  // ← tu LoginComponent llama esAdmin() como método
  esAdmin(): boolean { return this._user.value?.rol === 'ADMIN'; }

  get isAdmin(): boolean { return this.esAdmin(); }
  get isLoggedIn(): boolean { return !!this._user.value; }

  // ← tu LoginComponent llama login({ email, password }) con un objeto
  login(credenciales: { email: string; password: string }) {
    return this.http.post<any>(`${this.API}/login`, credenciales).pipe(
      tap(res => {
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        this._user.next(res.usuario);
      })
    );
  }

  // ← tu RegisterComponent llama registrar() no register()
  registrar(datos: { nombre: string; email: string; password: string; telefono?: string }) {
    return this.http.post<any>(`${this.API}/register`, datos);
  }

  // por si algo en el proyecto llama register() también
  register(datos: any) { return this.registrar(datos); }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this._user.next(null);
    this.router.navigate(['/login']);
  }
}