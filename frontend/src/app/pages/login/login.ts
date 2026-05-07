import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  email = '';
  password = '';

  mensajeError = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login() {
    this.mensajeError = '';

    this.auth.login({
      email: this.email,
      password: this.password,
    }).subscribe({
      next: (res: any) => {
        this.auth.guardarToken(res.access_token);
        console.log('Login correcto');

        this.router.navigate(['/menu']);
      },

      error: (err) => {
        console.log(err);

        if (err.status === 401) {
          this.mensajeError = 'Usuario o contraseña incorrectos';
        } else {
          this.mensajeError = 'Error del servidor';
        }
      }
    });
  }
}