import { Component, inject, signal, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AdminService } from './../../../core/services/admin.service'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>Dashboard</h2>
        <p class="text-muted">Resumen general del sistema</p>
      </div>

      @if (loading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Cargando estadísticas...</p>
        </div>
      } @else if (stats()) {
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon blue">
              <i class="bi bi-people"></i>
            </div>
            <div>
              <span class="stat-label">Total Usuarios</span>
              <span class="stat-value">{{ stats().totalUsuarios || 0 }}</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon green">
              <i class="bi bi-heart-pulse"></i>
            </div>
            <div>
              <span class="stat-label">Médicos</span>
              <span class="stat-value">{{ stats().totalMedicos || 0 }}</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon orange">
              <i class="bi bi-person-workspace"></i>
            </div>
            <div>
              <span class="stat-label">Enfermeras</span>
              <span class="stat-value">{{ stats().totalEnfermeras || 0 }}</span>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <h3>Citas por Especialidad</h3>
          <canvas id="chartBar" height="100"></canvas>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container { padding: 2rem; }
    .page-header { margin-bottom: 2rem; }
    .page-header h2 { font-size: 1.8rem; font-weight: 700; color: #1e293b; }
    .text-muted { color: #64748b; }
    .loading-state { text-align: center; padding: 3rem; }
    .spinner { width: 2.5rem; height: 2.5rem; border: 3px solid #e2e8f0; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
    .stat-card { background: white; border-radius: 1rem; padding: 1.5rem; display: flex; align-items: center; gap: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
    .stat-icon { width: 3.5rem; height: 3.5rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
    .blue { background: #eff6ff; color: #2563eb; }
    .green { background: #f0fdf4; color: #16a34a; }
    .orange { background: #fff7ed; color: #ea580c; }
    .stat-label { font-size: 0.9rem; color: #64748b; display: block; }
    .stat-value { font-size: 1.8rem; font-weight: 700; color: #1e293b; }
    .chart-card { background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
    .chart-card h3 { font-size: 1.3rem; font-weight: 600; color: #334155; margin-bottom: 1rem; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats = signal<any>(null)
  loading = signal(true)
  private svc = inject(AdminService)

  ngOnInit() {
    this.svc.getStats().subscribe({
      next: (res) => {
        this.stats.set(res)
        this.loading.set(false)
        setTimeout(() => this.renderChart(), 50)
      },
      error: () => this.loading.set(false)
    })
  }

  renderChart() {
    const data = this.stats()
    if (!data) return
    const ctx = document.getElementById('chartBar') as HTMLCanvasElement
    if (!ctx) return
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.citasPorEspecialidad?.map((c: any) => c.nombre) || [],
        datasets: [{ data: data.citasPorEspecialidad?.map((c: any) => c.cantidad) || [], backgroundColor: '#2563eb', borderRadius: 6 }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    })
  }
}