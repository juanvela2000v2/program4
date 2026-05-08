import { Component, inject, signal, OnInit } from "@angular/core"
import { CitaService } from "../../../core/services/cita.service"

@Component({
  selector: 'app-fila-virtual',
  template: `
    <div class="fila-container">
      <h2>Mi Fila Virtual</h2>
      <p class="text-muted">Estado de sus citas en tiempo real</p>

      <div class="fila-grid">
        <div class="fila-card">
          <div class="card-badge">
            <i class="bi bi-calendar-heart"></i> Cita Médica
          </div>
          <div class="card-body">
            @if (!medicoLlamado()) {
              <div class="estado-pendiente">
                <i class="bi bi-hourglass-split"></i>
                <p>Aún no ha sido llamado para cita médica</p>
              </div>
            } @else {
              <div class="estado-llamado">
                <i class="bi bi-bell-fill"></i>
                <p class="mensaje-llamado">¡Ha sido llamado!</p>
                <div class="info-detalle">
                  <p><strong>Especialidad:</strong> {{ medicoInfo().especialidad }}</p>
                  <p><strong>Número:</strong> {{ medicoInfo().numero }}</p>
                  <p><strong>Sala:</strong> {{ medicoInfo().sala }}</p>
                </div>
              </div>
            }
          </div>
        </div>

        <div class="fila-card">
          <div class="card-badge enfermeria">
            <i class="bi bi-heart-pulse"></i> Cita de Enfermería
          </div>
          <div class="card-body">
            @if (!enfermeriaLlamado()) {
              <div class="estado-pendiente">
                <i class="bi bi-hourglass-split"></i>
                <p>Aún no ha sido llamado para enfermería</p>
              </div>
            } @else {
              <div class="estado-llamado">
                <i class="bi bi-bell-fill"></i>
                <p class="mensaje-llamado">¡Ha sido llamado!</p>
                <div class="info-detalle">
                  <p><strong>Número:</strong> {{ enfermeriaInfo().numero }}</p>
                  <p><strong>Sala:</strong> {{ enfermeriaInfo().sala }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fila-container { max-width: 700px; margin: 0 auto; padding: 1rem 0; }
    h2 { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 0.3rem; }
    .text-muted { color: #64748b; margin-bottom: 1.5rem; }
    .fila-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    @media (max-width: 600px) { .fila-grid { grid-template-columns: 1fr; } }
    .fila-card {
      background: white; border-radius: 1rem; overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    .card-badge {
      padding: 0.6rem 1.2rem; font-weight: 700; font-size: 1rem;
      color: white; background: #2563eb; display: flex; align-items: center; gap: 0.5rem;
    }
    .card-badge.enfermeria { background: #059669; }
    .card-body { padding: 1.5rem; }
    .estado-pendiente { text-align: center; color: #94a3b8; padding: 1rem 0; }
    .estado-pendiente i { font-size: 2.5rem; display: block; margin-bottom: 0.5rem; opacity: 0.5; }
    .estado-llamado { text-align: center; }
    .estado-llamado i { font-size: 2rem; color: #f59e0b; margin-bottom: 0.5rem; }
    .mensaje-llamado { font-size: 1.2rem; font-weight: 700; color: #1e293b; margin-bottom: 1rem; }
    .info-detalle { text-align: left; background: #f8fafc; border-radius: 0.5rem; padding: 1rem; }
    .info-detalle p { margin-bottom: 0.4rem; color: #334155; }
  `],
  standalone: true
})
export class FilaVirtualComponent implements OnInit {
  medicoLlamado = signal(false)
  medicoInfo = signal<any>({})
  enfermeriaLlamado = signal(false)
  enfermeriaInfo = signal<any>({})

  private svc = inject(CitaService)

  ngOnInit() {
    this.svc.getFilaMedica().subscribe((res: any) => {
      if (res.llamado) {
        this.medicoLlamado.set(true)
        this.medicoInfo.set(res)
      }
    })
    this.svc.getFilaEnfermeria().subscribe((res: any) => {
      if (res.llamado) {
        this.enfermeriaLlamado.set(true)
        this.enfermeriaInfo.set(res)
      }
    })
  }
}