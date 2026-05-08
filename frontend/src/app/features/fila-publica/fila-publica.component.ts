import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environment'
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-fila-publica',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="fila-publica">
      <div class="fila-header">
        <div class="header-brand">
          <i class="bi bi-hospital"></i>
          <span>Hospital - Fila Virtual</span>
        </div>
        
      </div>

      <div class="fila-content">
        <h2 class="fila-title">Fila Virtual</h2>

        @if (!datos()) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Cargando información...</p>
          </div>
        } @else {
          <div class="fila-grid">
            <!-- Consultorios Médicos -->
            @for (esp of datos()?.especialidades; track esp.especialidad) {
              <div class="fila-card medico">
                <div class="card-badge">Consultorio Médico</div>
                <h3>{{ esp.especialidad }}</h3>
                <div class="card-info">
                  <div class="info-row">
                    <i class="bi bi-person-circle"></i>
                    <span><strong>Paciente:</strong> {{ esp.paciente }}</span>
                  </div>
                  <div class="info-row">
                    <i class="bi bi-door-open"></i>
                    <span><strong>Sala:</strong> {{ esp.sala }}</span>
                  </div>
                </div>
              </div>
            }

            <!-- Enfermería -->
            <div class="fila-card enfermeria">
              <div class="card-badge">Enfermería</div>
              <h3>Atención de Enfermería</h3>
              <div class="card-info">
                @if (datos()?.enfermeria) {
                  <div class="info-row">
                    <i class="bi bi-person-circle"></i>
                    <span><strong>Paciente:</strong> {{ datos()?.enfermeria?.paciente }}</span>
                  </div>
                  <div class="info-row">
                    <i class="bi bi-door-open"></i>
                    <span><strong>Sala:</strong> {{ datos()?.enfermeria?.sala }}</span>
                  </div>
                } @else {
                  <p class="text-muted">No hay paciente siendo atendido</p>
                }
                <div class="espera-badge">
                  <i class="bi bi-people"></i>
                  Pacientes en espera: {{ datos()?.esperaEnfermeria }}
                </div>
              </div>
            </div>
          </div>

          @if (!datos()?.especialidades?.length && !datos()?.enfermeria) {
            <div class="empty-state">
              <i class="bi bi-emoji-smile"></i>
              <p>No hay pacientes siendo atendidos en este momento</p>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .fila-publica {
      min-height: 100vh;
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    }
    .fila-header {
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
    .header-actions {
      display: flex;
      gap: 0.7rem;
    }
    .btn-login {
      padding: 0.5rem 1.2rem;
      background: #2563eb;
      color: white;
      border-radius: 0.5rem;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
    }
    .btn-login:hover { background: #1d4ed8; }
    .btn-registro {
      padding: 0.5rem 1.2rem;
      background: white;
      color: #2563eb;
      border: 2px solid #2563eb;
      border-radius: 0.5rem;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
    }
    .btn-registro:hover { background: #eff6ff; }
    .fila-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
    }
    .fila-title {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      text-align: center;
      margin-bottom: 0.3rem;
    }
    .fila-subtitle {
      text-align: center;
      color: #64748b;
      margin-bottom: 2rem;
    }
    .loading-state { text-align: center; padding: 3rem; }
    .spinner {
      width: 3rem; height: 3rem; border: 3px solid #e2e8f0;
      border-top-color: #2563eb; border-radius: 50%;
      animation: spin 0.8s linear infinite; margin: 0 auto 1rem;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .fila-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .fila-card {
      background: white;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    }
    .card-badge {
      padding: 0.5rem 1rem;
      font-weight: 700;
      font-size: 0.9rem;
      color: white;
    }
    .medico .card-badge { background: #2563eb; }
    .enfermeria .card-badge { background: #059669; }
    .fila-card h3 {
      padding: 1rem 1.5rem 0;
      font-size: 1.3rem;
      font-weight: 600;
      color: #1e293b;
    }
    .card-info { padding: 1rem 1.5rem 1.5rem; }
    .info-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      color: #334155;
      font-size: 1.05rem;
    }
    .info-row i { font-size: 1.3rem; color: #64748b; }
    .text-muted { color: #94a3b8; font-style: italic; }
    .espera-badge {
      margin-top: 0.75rem;
      padding: 0.5rem 0.75rem;
      background: #f8fafc;
      border-radius: 0.5rem;
      color: #64748b;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .empty-state {
      text-align: center;
      padding: 4rem 1rem;
      color: #64748b;
    }
    .empty-state i { font-size: 3rem; color: #94a3b8; display: block; margin-bottom: 1rem; }
    .empty-state p { font-size: 1.2rem; }
  `]
})
export class FilaPublicaComponent implements OnInit, OnDestroy {
  datos = signal<any>(null)
  private intervalId: any
  private http = inject(HttpClient)

  ngOnInit() {
    this.cargar()
    this.intervalId = setInterval(() => this.cargar(), 3000)
  }

  ngOnDestroy() {
    clearInterval(this.intervalId)
  }

  cargar() {
    this.http.get(`${environment.apiUrl}/fila-publica`).subscribe({
      next: (res) => this.datos.set(res),
      error: () => console.log('Error al cargar fila pública')
    })
  }
}