import { Component } from '@angular/core'
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router' 

@Component({
  selector: 'app-usuario-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive  ],
  template: `
    <div class="usuario-layout">
      <header class="usuario-header">
        <div class="header-brand">
          <i class="bi bi-hospital"></i>
          <span>Sistema Hospitalario</span>
        </div>
        <nav class="header-nav">
          <a routerLink="/usuario" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Inicio</a>
          <a routerLink="/usuario/cita-medica" routerLinkActive="active">Cita Médica</a>
          <a routerLink="/usuario/cita-enfermeria" routerLinkActive="active">Cita Enfermería</a>
          <a routerLink="/usuario/fila-virtual" routerLinkActive="active">Fila Virtual</a>
          <a routerLink="/fila-publica" routerLinkActive="active">Fila Pública</a>
        </nav>
        <div class="header-user">
          <a routerLink="/login" class="btn-logout">Cerrar Sesión</a>
        </div>
      </header>
      <main class="usuario-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .usuario-layout {
      min-height: 100vh;
      background: #f8fafc;
    }
    .usuario-header {
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .header-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.3rem;
      font-weight: 700;
      color: #2563eb;
    }
    .header-brand i { font-size: 1.8rem; }
    .header-nav {
      display: flex;
      gap: 0.3rem;
    }
    .header-nav a {
      text-decoration: none;
      color: #475569;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-weight: 500;
      font-size: 0.95rem;
      transition: all 0.2s;
    }
    .header-nav a:hover { background: #eff6ff; color: #2563eb; }
    .header-nav a.active { background: #2563eb; color: white; }
    .header-user .btn-logout {
      text-decoration: none;
      color: #dc2626;
      font-weight: 600;
      font-size: 0.9rem;
    }
    .usuario-main {
      padding: 2rem;
    }
  `]
})
export class UsuarioLayoutComponent {}