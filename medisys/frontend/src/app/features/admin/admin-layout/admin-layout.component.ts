import { Component, inject, signal } from '@angular/core'
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-layout">
      <!-- Sidebar -->
      <aside class="sidebar" [class.collapsed]="!sidebarOpen()">
        <div class="sidebar-header">
          @if (sidebarOpen()) {
            <div>
              <h1>Panel Admin</h1>
              <p>Administrador</p>
            </div>
          }
          <button class="toggle-btn" (click)="sidebarOpen.set(!sidebarOpen())">
            <i class="bi" [class.bi-list]="!sidebarOpen()" [class.bi-x]="sidebarOpen()"></i>
          </button>
        </div>

        <nav class="sidebar-nav">
          @for (item of menuItems; track item.href) {
            <button
              class="nav-item"
              [class.active]="isActive(item.href)"
              (click)="navigate(item.href)"
            >
              <i class="bi {{ item.icon }}"></i>
              @if (sidebarOpen()) { <span>{{ item.title }}</span> }
            </button>
          }
        </nav>

        <div class="sidebar-footer">
          <button class="logout-btn" (click)="logout()">
            <i class="bi bi-box-arrow-right"></i>
            @if (sidebarOpen()) { <span>Cerrar Sesión</span> }
          </button>
        </div>
      </aside>

      <!-- Contenido principal -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      min-height: 100vh;
      background: #f9fafb;
    }
    .sidebar {
      background: #111827;
      color: white;
      display: flex;
      flex-direction: column;
      transition: width 0.3s;
      width: 260px;
      flex-shrink: 0;
    }
    .sidebar.collapsed {
      width: 80px;
    }
    .sidebar-header {
      padding: 1rem;
      border-bottom: 1px solid #374151;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .sidebar-header h1 { font-size: 1.2rem; font-weight: 700; }
    .sidebar-header p { font-size: 0.8rem; color: #9ca3af; }
    .toggle-btn {
      background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer;
    }
    .sidebar-nav { flex: 1; padding: 0.5rem; display: flex; flex-direction: column; gap: 0.2rem; }
    .nav-item {
      width: 100%; display: flex; align-items: center; gap: 0.75rem;
      padding: 0.75rem 1rem; border: none; background: transparent; color: #d1d5db;
      border-radius: 0.5rem; font-size: 0.95rem; font-weight: 500; cursor: pointer;
      transition: background 0.2s;
    }
    .nav-item:hover { background: #1f2937; }
    .nav-item.active { background: #2563eb; color: white; }
    .nav-item i { font-size: 1.3rem; width: 1.5rem; text-align: center; }
    .sidebar-footer { padding: 0.5rem; border-top: 1px solid #374151; }
    .logout-btn {
      width: 100%; display: flex; align-items: center; gap: 0.75rem;
      padding: 0.75rem 1rem; border: none; background: transparent; color: #f87171;
      border-radius: 0.5rem; font-size: 0.95rem; font-weight: 500; cursor: pointer;
      transition: background 0.2s;
    }
    .logout-btn:hover { background: rgba(248,113,113,0.1); }
    .logout-btn i { font-size: 1.3rem; width: 1.5rem; text-align: center; }
    .main-content { flex: 1; overflow: auto; }
  `]
})
export class AdminLayoutComponent {
  sidebarOpen = signal(true)
  private router = inject(Router)

  menuItems = [
    { icon: 'bi-house', title: 'Inicio', href: '/admin' },
    { icon: 'bi-people', title: 'Usuarios', href: '/admin/usuarios' },
    { icon: 'bi-heart-pulse', title: 'Médicos', href: '/admin/medicos' },
    { icon: 'bi-person-workspace', title: 'Enfermeras', href: '/admin/enfermeras' },
    { icon: 'bi-tools', title: 'Especialidades', href: '/admin/especialidades' },
    { icon: 'bi-box-seam', title: 'Almacén', href: '/admin/almacen' },
    { icon: 'bi-graph-up', title: 'Estadísticas', href: '/admin/estadisticas' }
  ]

  isActive(href: string): boolean {
    const current = this.router.url
    if (href === '/admin') return current === '/admin'
    return current.startsWith(href)
  }

  navigate(href: string) {
    this.router.navigate([href])
  }

  logout() {
    this.router.navigate(['/login'])
  }
}