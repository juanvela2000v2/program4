import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  usuario = { nombre: '', email: '', password: '', telefono: '' };
  confirmarPassword = '';
  cargando = false;
  error    = '';
  exito    = false;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.error = '';

    if (!this.usuario.nombre || !this.usuario.email || !this.usuario.password) {
      this.error = 'Nombre, email y contraseña son obligatorios.';
      return;
    }
    if (this.usuario.password !== this.confirmarPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }
    if (this.usuario.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    this.cargando = true;
    this.authService.registrar(this.usuario).subscribe({
      next: () => {
        this.cargando = false;
        this.exito    = true;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.cargando = false;
        this.error    = err?.error?.message ?? 'Error al registrar. Intenta de nuevo.';
      }
    });
  }

  irLogin() {
    this.router.navigate(['/login']);
  }
}