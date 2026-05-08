import { Component, inject, signal } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { AuthService } from "../../../core/services/auth.service"
import { Router, RouterLink } from "@angular/router"

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="registro-wrapper">
      <div class="registro-card">
        <div class="registro-icon">
          <i class="bi bi-person-plus"></i>
        </div>
        <h1 class="registro-title">Registro de Usuario</h1>
        <p class="registro-subtitle">Complete el formulario para crear su cuenta</p>

        <form (ngSubmit)="onSubmit()" class="registro-form">
          @if (error()) {
            <div class="alert alert-error">
              <i class="bi bi-exclamation-triangle"></i>
              {{ error() }}
            </div>
          }
          @if (success()) {
            <div class="alert alert-success">
              <i class="bi bi-check-circle"></i>
              Registro exitoso. Redirigiendo al login...
            </div>
          }

          <div class="row-double">
            <div class="input-group">
              <label for="nombre">Nombre *</label>
              <input id="nombre" type="text" [(ngModel)]="nombre" name="nombre" placeholder="Ej: Juan" class="form-control-lg" />
            </div>
            <div class="input-group">
              <label for="apellidoPaterno">Apellido Paterno *</label>
              <input id="apellidoPaterno" type="text" [(ngModel)]="apellidoPaterno" name="apellidoPaterno" placeholder="Ej: Pérez" class="form-control-lg" />
            </div>
          </div>

          <div class="row-double">
            <div class="input-group">
              <label for="apellidoMaterno">Apellido Materno *</label>
              <input id="apellidoMaterno" type="text" [(ngModel)]="apellidoMaterno" name="apellidoMaterno" placeholder="Ej: López" class="form-control-lg" />
            </div>
            <div class="input-group">
              <label for="ci">CI *</label>
              <input id="ci" type="text" [(ngModel)]="ci" name="ci" placeholder="Ej: 12345678" class="form-control-lg" />
            </div>
          </div>

          <div class="row-double">
            <div class="input-group">
              <label for="fechaNacimiento">Fecha de Nacimiento *</label>
              <input id="fechaNacimiento" type="date" [(ngModel)]="fechaNacimiento" name="fechaNacimiento" class="form-control-lg" />
            </div>
            <div class="input-group">
              <label for="sexo">Sexo *</label>
              <select id="sexo" [(ngModel)]="sexo" name="sexo" class="form-control-lg">
                <option value="">Seleccione</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
          </div>

          <div class="row-double">
            <div class="input-group">
              <label for="direccion">Dirección *</label>
              <input id="direccion" type="text" [(ngModel)]="direccion" name="direccion" placeholder="Calle, número, zona" class="form-control-lg" />
            </div>
            <div class="input-group">
              <label for="telefono">Teléfono *</label>
              <input id="telefono" type="text" [(ngModel)]="telefono" name="telefono" placeholder="Ej: 71234567" class="form-control-lg" />
            </div>
          </div>

          <div class="input-group">
            <label for="correo">Correo Electrónico (Opcional)</label>
            <input id="correo" type="email" [(ngModel)]="correo" name="correo" placeholder="ejemplo@correo.com" class="form-control-lg" />
          </div>

          <div class="input-group">
            <label for="codigoAsegurado">Código de Asegurado (Opcional)</label>
            <input id="codigoAsegurado" type="text" [(ngModel)]="codigoAsegurado" name="codigoAsegurado" placeholder="Ej: 6308250CSMIM003" class="form-control-lg" />
          </div>

          <div class="row-double">
            <div class="input-group">
              <label for="login">Usuario *</label>
              <input id="login" type="text" [(ngModel)]="login" name="login" placeholder="Elija un usuario" class="form-control-lg" />
            </div>
            <div class="input-group">
              <label for="pass">Contraseña *</label>
              <input id="pass" type="password" [(ngModel)]="pass" name="pass" placeholder="Mínimo 6 caracteres" class="form-control-lg" />
            </div>
          </div>

          <button type="submit" [disabled]="loading()" class="btn-registro">
            @if (loading()) {
              <span class="spinner"></span> Registrando...
            } @else {
              Crear Cuenta
            }
          </button>

          <p class="login-link">
            ¿Ya tiene cuenta? <a routerLink="/login">Inicie sesión aquí</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .registro-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      padding: 2rem 1rem;
    }
    .registro-card {
      background: white;
      border-radius: 1.5rem;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15);
      padding: 2.5rem 2rem;
      width: 100%;
      max-width: 700px;
      text-align: center;
    }
    .registro-icon {
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
    .registro-title {
      font-size: 1.8rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.3rem;
    }
    .registro-subtitle {
      font-size: 1rem;
      color: #64748b;
      margin-bottom: 2rem;
    }
    .registro-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
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
    .alert-success {
      background: #f0fdf4;
      color: #16a34a;
      padding: 0.8rem 1rem;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }
    .row-double {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    @media (max-width: 500px) {
      .row-double {
        grid-template-columns: 1fr;
      }
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
    .form-control-lg {
      width: 100%;
      padding: 0.9rem;
      border: 2px solid #e2e8f0;
      border-radius: 0.75rem;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }
    select.form-control-lg {
      background: white;
    }
    .form-control-lg:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
    }
    .btn-registro {
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
    .btn-registro:hover:not(:disabled) {
      background: #1d4ed8;
    }
    .btn-registro:disabled {
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
    .login-link {
      text-align: center;
      color: #64748b;
    }
    .login-link a {
      color: #2563eb;
      font-weight: 600;
      text-decoration: none;
    }
  `]
})
export class RegistroComponent {
  nombre: string = ''
  apellidoPaterno: string = ''
  apellidoMaterno: string = ''
  ci: string = ''
  fechaNacimiento: string = ''
  sexo: string = ''
  direccion: string = ''
  telefono: string = ''
  correo: string = ''
  codigoAsegurado: string = ''
  login: string = ''
  pass: string = ''

  loading = signal<boolean>(false)
  error = signal<string>('')
  success = signal<boolean>(false)

  authService = inject(AuthService)
  router = inject(Router)

  onSubmit() {
    this.loading.set(true)
    this.error.set('')
    this.success.set(false)

    this.authService.registro({
      nombre: this.nombre,
      apellidoPaterno: this.apellidoPaterno,
      apellidoMaterno: this.apellidoMaterno,
      ci: this.ci,
      fechaNacimiento: this.fechaNacimiento,
      sexo: this.sexo,
      direccion: this.direccion,
      telefono: this.telefono,
      correo: this.correo,
      codigoAsegurado: this.codigoAsegurado,
      login: this.login,
      pass: this.pass
    }).subscribe({
      next: () => {
        this.success.set(true)
        setTimeout(() => this.router.navigate(['/login']), 2000)
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al registrar usuario')
        this.loading.set(false)
      }
    })
  }
}