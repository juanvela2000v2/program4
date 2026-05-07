import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly tokenKey = 'cambalacheToken';
  private readonly userKey = 'cambalacheUser';

  currentUser$ = new BehaviorSubject<any>(this.loadUser());
  token$ = new BehaviorSubject<string | null>(this.loadToken());

  private loadToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private loadUser(): any {
    const stored = localStorage.getItem(this.userKey);
    return stored ? JSON.parse(stored) : null;
  }

  setSession(token: string, user: any) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.token$.next(token);
    this.currentUser$.next(user);
  }

  clearSession() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.token$.next(null);
    this.currentUser$.next(null);
  }

  getToken(): string | null {
    return this.token$.value;
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}
