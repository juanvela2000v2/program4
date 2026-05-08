import { Component } from '@angular/core'
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-enfermera-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="enfermera-layout">
      <header class="enfermera-header">
        <div class="header-brand">
          <i class="bi bi-heart-pulse"></i>
          <span>Panel de Enfermería</span>
        </div>
        <nav class="header-nav">
          <a routerLink="/enfermera" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
            <i class="bi bi-house"></i> Inicio
          </a>
          <a routerLink="/enfermera/fila" routerLinkActive="active">
            <i class="bi bi-people"></i> Fila Virtual
          </a>
          <a routerLink="/enfermera/almacen" routerLinkActive="active">
            <i class="bi bi-box-seam"></i> Almacén
          </a>
        </nav>
        <div class="header-actions">
          <a routerLink="/login" class="btn-logout">
            <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
          </a>
        </div>
      </header>
      <main class="enfermera-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .enfermera-layout {
      min-height: 100vh;
      background: #f8fafc;
    }
    .enfermera-header {
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
      color: #059669;
    }
    .header-brand i {
      font-size: 1.8rem;
    }
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
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .header-nav a:hover {
      background: #f0fdf4;
      color: #059669;
    }
    .header-nav a.active {
      background: #059669;
      color: white;
    }
    .header-actions .btn-logout {
      text-decoration: none;
      color: #dc2626;
      font-weight: 600;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }
    .enfermera-main {
      padding: 2rem;
    }
  `]
})
export class EnfermeraLayoutComponent {}