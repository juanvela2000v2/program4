import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  credenciales = { email: '', password: '' };
  cargando     = false;
  error        = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if (!this.credenciales.email || !this.credenciales.password) {
      this.error = 'Completa todos los campos.';
      return;
    }
    this.cargando = true;
    this.error    = '';

    this.authService.login(this.credenciales).subscribe({
      next: () => {
        this.cargando = false;
        if (this.authService.esAdmin()) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/mapa']);
        }
      },
      error: (err) => {
        this.cargando = false;
        this.error    = err?.error?.message ?? 'Credenciales inválidas. Intenta de nuevo.';
      }
    });
  }
}