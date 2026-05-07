import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutenticacionService } from '../../core/autenticacion.service';
import { SessionService } from '../../core/session.service';

@Component({
  selector: 'app-autenticacion',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section>
      <h2>Autenticación</h2>

      <div class="toggle-buttons">
        <button type="button" (click)="modoRegistro = false" [disabled]="!modoRegistro">Iniciar Sesión</button>
        <button type="button" (click)="modoRegistro = true" [disabled]="modoRegistro">Registrar Usuario</button>
      </div>

      <form (ngSubmit)="submit()">
        <label *ngIf="modoRegistro">
          Nombre:
          <input type="text" [(ngModel)]="nombre" name="nombre" required />
        </label>

        <label>
          Email:
          <input type="email" [(ngModel)]="email" name="email" required />
        </label>

        <label>
          Contraseña:
          <input type="password" [(ngModel)]="password" name="password" required />
        </label>

        <div *ngIf="modoRegistro">
          <label>
            Avatar:
            <input type="text" [(ngModel)]="avatar" name="avatar" placeholder="URL de la imagen" />
          </label>

          <label>
            Fecha de nacimiento:
            <input type="date" [(ngModel)]="fechaNacimiento" name="fechaNacimiento" />
          </label>

          <label>
            Teléfono:
            <input type="text" [(ngModel)]="telefono" name="telefono" />
          </label>

          <label>
            Dirección:
            <input type="text" [(ngModel)]="direccion" name="direccion" />
          </label>

          <label>
            Ciudad:
            <input type="text" [(ngModel)]="ciudad" name="ciudad" />
          </label>

          <label>
            País:
            <input type="text" [(ngModel)]="pais" name="pais" />
          </label>

          <label>
            Descripción del perfil:
            <textarea [(ngModel)]="descripcion" name="descripcion"></textarea>
          </label>

          <label>
            Carnet / Imagen:
            <input type="text" [(ngModel)]="carnetImagen" name="carnetImagen" placeholder="URL o texto de identificación" />
          </label>
        </div>

        <button type="submit">{{ modoRegistro ? 'Registrar' : 'Iniciar Sesión' }}</button>
      </form>

      <div *ngIf="message" class="message">{{ message }}</div>
      <div *ngIf="resultado">
        <h3>Respuesta del servidor</h3>
        <pre>{{ resultado | json }}</pre>
      </div>
    </section>
  `,
  styles: [
    `
      .toggle-buttons {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
      }
      label {
        display: block;
        margin-bottom: 10px;
      }
      textarea {
        width: 100%;
        min-height: 80px;
      }
      button {
        padding: 10px 16px;
      }
      .message {
        margin-top: 16px;
        font-weight: bold;
      }
    `,
  ],
})
export class AutenticacionComponent {
  modoRegistro = false;
  nombre = '';
  email = '';
  password = '';
  avatar = '';
  fechaNacimiento = '';
  telefono = '';
  direccion = '';
  ciudad = '';
  pais = '';
  descripcion = '';
  carnetImagen = '';
  resultado: any;
  message = '';

  constructor(
    private readonly auth: AutenticacionService,
    private readonly session: SessionService,
  ) {}

  submit() {
    if (this.modoRegistro) {
      const payload = {
        nombre: this.nombre,
        email: this.email,
        password: this.password,
        avatar: this.avatar,
        fechaNacimiento: this.fechaNacimiento,
        telefono: this.telefono,
        direccion: this.direccion,
        ciudad: this.ciudad,
        pais: this.pais,
        descripcion: this.descripcion,
        carnetImagen: this.carnetImagen || 'sin-imagen',
      };

      this.auth.register(payload).subscribe({
        next: result => {
          this.resultado = result;
          this.session.setSession(result.accessToken, result.usuario);
          this.message = 'Usuario registrado y sesión iniciada correctamente.';
          this.modoRegistro = false;
        },
        error: error => {
          const errorMessage = error?.error?.message || error?.message || 'Error en registro';
          this.resultado = { error: errorMessage };
          this.message = '';
        },
      });
    } else {
      this.auth.login(this.email, this.password).subscribe({
        next: result => {
          this.resultado = result;
          this.session.setSession(result.accessToken, result.usuario);
          this.message = 'Sesión iniciada correctamente.';
        },
        error: error => {
          const errorMessage = error?.error?.message || error?.message || 'Error en autenticación';
          this.resultado = { error: errorMessage };
          this.message = '';
        },
      });
    }
  }
}
