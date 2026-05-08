import { Component, inject, signal } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { AuthService } from "../../../core/services/auth.service"
import { Router, RouterLink } from "@angular/router"

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        <div class="login-icon">
          <i class="bi bi-hospital"></i>
        </div>
        <h1 class="login-title">Sistema Hospitalario</h1>
        <p class="login-subtitle">Ingrese sus credenciales para acceder</p>

        <form (ngSubmit)="onSubmit()" class="login-form">
          @if (error()) {
            <div class="alert alert-error">
              <i class="bi bi-exclamation-triangle"></i>
              {{ error() }}
            </div>
          }

          <div class="input-group">
            <label for="login">Usuario</label>
            <div class="input-icon-wrapper">
              <i class="bi bi-person input-icon"></i>
              <input
                id="login"
                type="text"
                [(ngModel)]="login"
                name="login"
                placeholder="Ingrese su usuario"
                class="form-control-lg"
              />
            </div>
          </div>

          <div class="input-group">
            <label for="pass">Contraseña</label>
            <div class="input-icon-wrapper">
              <i class="bi bi-lock input-icon"></i>
              <input
                id="pass"
                type="password"
                [(ngModel)]="pass"
                name="pass"
                placeholder="Ingrese su contraseña"
                class="form-control-lg"
              />
            </div>
          </div>

          <button type="submit" [disabled]="loading()" class="btn-login">
            @if (loading()) {
              <span class="spinner"></span> Ingresando...
            } @else {
              <i class="bi bi-box-arrow-in-right"></i> Iniciar Sesión
            }
          </button>

          <p class="register-link">
            ¿No tiene cuenta? <a routerLink="/registro">Regístrese aquí</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      padding: 1rem;
    }
    .login-card {
      background: white;
      border-radius: 1.5rem;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15);
      padding: 2.5rem 2rem;
      width: 100%;
      max-width: 440px;
      text-align: center;
    }
    .login-icon {
      width: 4.5rem;
      height: 4.5rem;
      background: #2563eb;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      color: white;
      font-size: 2.2rem;
    }
    .login-title {
      font-size: 1.8rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.3rem;
    }
    .login-subtitle {
      font-size: 1rem;
      color: #64748b;
      margin-bottom: 2rem;
    }
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
    }
    .alert-error {
      background: #fef2f2;
      color: #dc2626;
      padding: 0.8rem 1rem;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }
    .input-group {
      text-align: left;
    }
    .input-group label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.3rem;
      color: #334155;
    }
    .input-icon-wrapper {
      position: relative;
    }
    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #9ca3af;
      font-size: 1.1rem;
    }
    .form-control-lg {
      width: 100%;
      padding: 0.9rem 1rem 0.9rem 2.8rem;
      border: 2px solid #e2e8f0;
      border-radius: 0.75rem;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }
    .form-control-lg:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
    }
    .btn-login {
      width: 100%;
      padding: 0.9rem;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 0.75rem;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .btn-login:hover:not(:disabled) {
      background: #1d4ed8;
    }
    .btn-login:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .spinner {
      width: 1.2rem;
      height: 1.2rem;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .register-link {
      text-align: center;
      color: #64748b;
    }
    .register-link a {
      color: #2563eb;
      font-weight: 600;
      text-decoration: none;
    }
  `]
})
export class LoginComponent {
  login: string = ''
  pass: string = ''
  loading = signal<boolean>(false)
  error = signal<string>('')
  authService = inject(AuthService)
  router = inject(Router)

  onSubmit() {
    this.loading.set(true)
    this.error.set('')
    this.authService.login(this.login, this.pass).subscribe({
      next: (res) => {
        this.authService.setRole(res.rol)
        if (res.rol === 'admin') this.router.navigate(['/admin'])
        else if (res.rol === 'medico') this.router.navigate(['/medico'])
        else if (res.rol === 'enfermera') this.router.navigate(['/enfermera'])
        else this.router.navigate(['/usuario'])
      },
      error: () => {
        this.error.set('Credenciales incorrectas. Verifique usuario y contraseña.')
        this.loading.set(false)
      }
    })
  }
}