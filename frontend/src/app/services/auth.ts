import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = 'http://localhost:3000';
platformId = inject(PLATFORM_ID);
  constructor(private http: HttpClient,) {}

  register(data: any) {
    return this.http.post(`${this.api}/auth/register`, data);
  }

  login(data: any) {
    return this.http.post(`${this.api}/auth/login`, data);
  }

  guardarToken(token: string) {

  if (isPlatformBrowser(this.platformId)) {
    localStorage.setItem('token', token);
    
  }

}

  obtenerToken() {

  if (isPlatformBrowser(this.platformId)) {
    return localStorage.getItem('token');
  }

  return null;
}
logout() {

  if (isPlatformBrowser(this.platformId)) {
    localStorage.removeItem('token');
  }

}
}