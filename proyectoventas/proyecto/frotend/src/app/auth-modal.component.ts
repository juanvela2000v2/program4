import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen) {
      <div class="modal-overlay" (click)="close()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <button class="modal-close" (click)="close()">✕</button>
          <div class="modal-body">
            <h2>{{ isLogin() ? 'Iniciar sesión' : 'Registrarse' }}</h2>
            
            <div class="form-tabs">
              <button
                [class.active]="isLogin()"
                (click)="isLogin.set(true)"
                class="tab-button"
              >
                Iniciar sesión
              </button>
              <button
                [class.active]="!isLogin()"
                (click)="isLogin.set(false)"
                class="tab-button"
              >
                Registrarse
              </button>
            </div>

            @if (authService.error()) {
              <div class="error-message">{{ authService.error() }}</div>
            }

            <form (submit)="submit($event)" class="form-content">
              @if (!isLogin()) {
                <input
                  type="text"
                  [(ngModel)]="name"
                  name="name"
                  placeholder="Nombre completo"
                  required
                />
              }
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                placeholder="Correo electrónico"
                required
              />
              <input
                type="password"
                [(ngModel)]="password"
                name="password"
                placeholder="Contraseña"
                required
              />
              <button type="submit" [disabled]="authService.isLoading()">
                @if (authService.isLoading()) {
                  Cargando...
                } @else {
                  {{ isLogin() ? 'Iniciar sesión' : 'Registrarse' }}
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideIn 0.3s ease-out;
      max-width: 500px;
      width: 90%;
      position: relative;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-close {
      position: absolute;
      top: 16px;
      right: 16px;
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #6b7280;
      transition: color 0.2s;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-close:hover {
      color: #111827;
    }

    .modal-body {
      padding: 32px;
    }

    h2 {
      margin: 0 0 24px;
      font-size: 24px;
      color: #1f2937;
    }

    .form-tabs {
      display: flex;
      gap: 8px;
      border-bottom: 1px solid #e5e7eb;
      margin-bottom: 16px;
    }

    .tab-button {
      padding: 8px 16px;
      background: none;
      border: none;
      cursor: pointer;
      color: #6b7280;
      font-weight: 500;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
    }

    .tab-button.active {
      color: #2563eb;
      border-bottom-color: #2563eb;
    }

    .error-message {
      padding: 12px;
      background: #fee2e2;
      color: #991b1b;
      border-radius: 4px;
      font-size: 14px;
      margin-bottom: 16px;
    }

    .form-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    input {
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.2s;
    }

    input:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    button[type="submit"] {
      padding: 10px 12px;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
      margin-top: 8px;
    }

    button[type="submit"]:hover:not(:disabled) {
      background: #1d4ed8;
    }

    button[type="submit"]:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  `],
})
export class AuthModalComponent {
  @Input() isOpen = false;
  @Output() closeEvent = new EventEmitter<void>();

  readonly isLogin = signal(true);
  email = '';
  name = '';
  password = '';

  constructor(readonly authService: AuthService) {}

  submit(e: Event) {
    e.preventDefault();
    if (this.isLogin()) {
      this.authService.login(this.email, this.password).subscribe({
        next: () => {
          this.email = '';
          this.password = '';
          this.close();
        },
      });
    } else {
      this.authService.register(this.email, this.name, this.password).subscribe({
        next: () => {
          this.email = '';
          this.name = '';
          this.password = '';
          this.isLogin.set(true);
        },
      });
    }
  }

  close() {
    this.closeEvent.emit();
  }
}
