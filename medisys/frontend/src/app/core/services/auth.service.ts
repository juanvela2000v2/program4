import { HttpClient } from '@angular/common/http'
import { inject, Injectable, signal } from '@angular/core'
import { environment } from '../../environment'

@Injectable({ providedIn: 'root' })
export class AuthService {
  http = inject(HttpClient)
  private currentRole = signal<string | null>(null)

  login(login: string, pass: string) {
    return this.http.post<{ message: string, rol: string }>(
      `${environment.apiUrl}/auth/login`,
      { login, pass },
      { withCredentials: true }
    )
  }

  registro(data: any) {
    return this.http.post(`${environment.apiUrl}/auth/registro`, data)
  }

  setRole(rol: string) {
    this.currentRole.set(rol)
  }

  getRole(): string | null {
    return this.currentRole()
  }

  checkAuth() {
    return this.http.get<boolean>(`${environment.apiUrl}/auth/check`, { withCredentials: true })
  }
}