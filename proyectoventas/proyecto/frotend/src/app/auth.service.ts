import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

export type User = {
  id: string;
  email: string;
  name: string;
  roles: string[];
};

type AuthResponse = { user: User };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = 'http://localhost:3000/api/auth';
  readonly currentUser = signal<User | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(private readonly http: HttpClient) {
    this.checkAuth();
  }

  register(email: string, name: string, password: string) {
    this.isLoading.set(true);
    this.error.set(null);
    return this.http
      .post<AuthResponse>(
        `${this.baseUrl}/register`,
        { email, name, password },
        { withCredentials: true },
      )
      .pipe(
        tap({
          next: (response) => {
            this.currentUser.set(response.user);
            this.isLoading.set(false);
          },
          error: (err) => {
            this.error.set(err.error?.message || 'Error registering');
            this.isLoading.set(false);
          },
        }),
      );
  }

  login(email: string, password: string) {
    this.isLoading.set(true);
    this.error.set(null);
    return this.http
      .post<AuthResponse>(
        `${this.baseUrl}/login`,
        { email, password },
        { withCredentials: true },
      )
      .pipe(
        tap({
          next: (response) => {
            this.currentUser.set(response.user);
            this.isLoading.set(false);
          },
          error: (err) => {
            this.error.set(err.error?.message || 'Invalid credentials');
            this.isLoading.set(false);
          },
        }),
      );
  }

  logout() {
    this.isLoading.set(true);
    return this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap({
        next: () => {
          this.currentUser.set(null);
          this.isLoading.set(false);
        },
      }),
    );
  }

  checkAuth() {
    this.http.get<User>(`${this.baseUrl}/me`, { withCredentials: true }).subscribe({
      next: (user) => this.currentUser.set(user),
      error: () => this.currentUser.set(null),
    });
  }

  isAuthenticated() {
    return this.currentUser() !== null;
  }

  hasRole(role: string) {
    return this.currentUser()?.roles.includes(role) ?? false;
  }
}
