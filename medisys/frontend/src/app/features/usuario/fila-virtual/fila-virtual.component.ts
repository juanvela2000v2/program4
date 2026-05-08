import { Component, inject, signal, OnInit } from "@angular/core"
import { CitaService } from "../../../core/services/cita.service"

@Component({
  selector: 'app-fila-virtual',
  template: `
    <div class="fila-container">
      <h2>Fila Virtual</h2>

      <div class="fila-grid">
        <div class="fila-card">
          <h3><i class="bi bi-calendar-heart"></i> Cita Médica</h3>
          @if (!medicoLlamado()) {
            <p class="estado-pendiente">Aún no ha sido llamado para cita médica.</p>
          } @else {
            <div class="info-llamado">
              <p><strong>Especialidad:</strong> {{ medicoInfo().especialidad }}</p>
              <p><strong>Número:</strong> {{ medicoInfo().numero }}</p>
              <p><strong>Sala:</strong> {{ medicoInfo().sala }}</p>
            </div>
          }
        </div>

        <div class="fila-card">
          <h3><i class="bi bi-heart-pulse"></i> Cita de Enfermería</h3>
          @if (!enfermeriaLlamado()) {
            <p class="estado-pendiente">Aún no ha sido llamado para enfermería.</p>
          } @else {
            <div class="info-llamado">
              <p><strong>Número:</strong> {{ enfermeriaInfo().numero }}</p>
              <p><strong>Sala:</strong> {{ enfermeriaInfo().sala }}</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fila-container { max-width: 700px; margin: 0 auto; }
    h2 { font-size: 1.8rem; font-weight: 700; color: #1e293b; margin-bottom: 1.5rem; }
    .fila-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .fila-card {
      background: white; border-radius: 1rem; padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    .fila-card h3 { font-size: 1.3rem; font-weight: 600; color: #334155; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
    .estado-pendiente { color: #64748b; font-style: italic; }
    .info-llamado p { margin-bottom: 0.5rem; color: #334155; }
    @media (max-width: 500px) { .fila-grid { grid-template-columns: 1fr; } }
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