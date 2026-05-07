import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (authService.currentUser()) {
      <div class="user-menu">
        <span>{{ authService.currentUser()?.name }}</span>
        <button (click)="logout()" class="logout-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Cerrar sesión
        </button>
      </div>
    } @else {
      <div class="user-menu">
        <button (click)="openAuthModal()" class="login-btn">Iniciar sesión</button>
      </div>
    }
  `,
  styles: [`
    .user-menu {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }

    .logout-btn:hover {
      background: #dc2626;
    }

    .login-btn {
      padding: 6px 16px;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.2s;
    }

    .login-btn:hover {
      background: #1d4ed8;
    }
  `],
})
export class AuthComponent {
  @Output() openAuthModalEvent = new EventEmitter<void>();

  constructor(readonly authService: AuthService) {}

  logout() {
    this.authService.logout().subscribe();
  }

  openAuthModal() {
    this.openAuthModalEvent.emit();
  }
}

