import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AsyncPipe, NgIf, NgClass } from '@angular/common';
import { SessionService } from './core/session.service';
import { AutenticacionService } from './core/autenticacion.service';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf, AsyncPipe, NgClass],
  template: `
    <header class="app-header">
      <nav>
        <a routerLink="/autenticacion">Autenticación</a>
        <a routerLink="/usuarios" *ngIf="isAdmin">Usuarios</a>
        <a routerLink="/mercado">Mercado</a>
        <a routerLink="/subastas">Subastas</a>
        <a routerLink="/pagos">Pagos</a>
        <a routerLink="/alertas" [ngClass]="{'alert-link': hasUnreadAlertas}">Alertas</a>
        <a routerLink="/tablero" [ngClass]="{'notif-link': hasUnreadChats}">Notificaciones</a>
      </nav>

      <div class="user-status" *ngIf="user$ | async as user">
        <button type="button" class="profile-button" (click)="profileOpen = !profileOpen">
          <img *ngIf="user.avatar" [src]="user.avatar" alt="avatar" />
          {{ user.nombre }}
        </button>

        <div class="profile-panel" *ngIf="profileOpen">
          <h3>Perfil de {{ user.nombre }}</h3>
          <div class="profile-grid">
            <div><strong>Email:</strong> {{ user.email }}</div>
            <div><strong>Rol:</strong> {{ user.rol }}</div>
            <div><strong>Estado:</strong> {{ user.estado }}</div>
            <div><strong>Fecha nacimiento:</strong> {{ user.fechaNacimiento || 'No registrado' }}</div>
            <div><strong>Teléfono:</strong> {{ user.telefono || 'No registrado' }}</div>
            <div><strong>Ciudad:</strong> {{ user.ciudad || 'No registrado' }}</div>
            <div><strong>País:</strong> {{ user.pais || 'No registrado' }}</div>
            <div><strong>Dirección:</strong> {{ user.direccion || 'No registrado' }}</div>
            <div><strong>Descripción:</strong> {{ user.descripcion || 'No registrado' }}</div>
          </div>
          <button type="button" (click)="logout()">Cerrar sesión</button>
        </div>
      </div>
    </header>

    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      padding: 12px 16px;
      background: #f5f5f5;
      border-bottom: 1px solid #ddd;
    }
    nav {
      display: flex;
      gap: 12px;
    }
    .alert-link {
      color: #dc3545 !important;
      font-weight: bold;
      animation: pulse 1s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
    .user-status {
      position: relative;
    }
    .profile-button {
      border: 1px solid #888;
      border-radius: 999px;
      padding: 8px 12px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: white;
    }
    .profile-button img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      object-fit: cover;
    }
    .profile-panel {
      position: absolute;
      right: 0;
      top: 44px;
      width: 320px;
      padding: 14px;
      background: white;
      border: 1px solid #ccc;
      box-shadow: 0 4px 12px rgba(0,0,0,.08);
      z-index: 10;
    }
    .profile-grid {
      display: grid;
      gap: 8px;
      margin-bottom: 12px;
    }
    .notif-link {
      color: #dc3545;
      font-weight: bold;
    }
  `],
})
export class AppComponent implements OnInit, OnDestroy {
  user$ = this.session.currentUser$;
  profileOpen = false;
  hasUnreadAlertas = false;
  hasUnreadChats = false;
  isAdmin = false;
  private socket: Socket | null = null;

  constructor(
    private readonly session: SessionService,
    private readonly authService: AutenticacionService,
  ) {}

  ngOnInit() {
    this.initUser();
    this.initAlertaListener();
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  private initUser() {
    const token = this.session.getToken();
    if (token) {
      this.authService.me(token).subscribe({
        next: user => {
          this.session.setSession(token, user);
          this.isAdmin = user?.rol === 'ADMIN' || user?.rol === 'SUPERADMIN';
        },
        error: () => {
          this.session.clearSession();
        },
      });
    }
  }

  private initAlertaListener() {
    const token = this.session.getToken();
    if (!token) return;

    this.socket = io('http://localhost:3000/auctions', {
      transports: ['websocket', 'polling'],
      reconnection: true,
    });

    this.socket.on('connect', () => {});

    this.socket.on('new_alerta', (alerta: any) => {
      this.hasUnreadAlertas = true;
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Nueva Alerta: ' + alerta.titulo, {
          body: alerta.mensaje,
          icon: '/favicon.ico',
        });
      }
    });

    this.socket.on('new_message', (msg: any) => {
      this.hasUnreadChats = true;
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Nuevo mensaje de ' + msg.senderName, {
          body: msg.message,
          icon: '/favicon.ico',
        });
      }
    });
  }

  logout() {
    this.session.clearSession();
    this.profileOpen = false;
    this.isAdmin = false;
  }
}
