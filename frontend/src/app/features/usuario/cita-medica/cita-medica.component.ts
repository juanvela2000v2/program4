import { Component, inject, signal, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { CitaService, Especialidad } from '../../../core/services/cita.service'
import { Router } from '@angular/router'
import QRCode from 'qrcode'

@Component({
  selector: 'app-cita-medica',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="cita-container">
      <h2>Reservar Cita Médica</h2>

      @if (error()) {
        <div class="alert alert-error">{{ error() }}</div>
      }

      @if (token()) {
        <div class="qr-section">
          <p>Escanea el código QR para realizar el pago:</p>
          <canvas #qrCanvas class="qr-canvas"></canvas>
          <a [routerLink]="['/usuario/pagar', token()]" class="btn-pago-alternativo">
            <i class="bi bi-wallet2"></i> Pagar en esta página
          </a>
        </div>
      } @else {
        <div class="form-card">
          <div class="input-group">
            <label for="especialidad">Especialidad</label>
            <select id="especialidad" [(ngModel)]="especialidadId" class="form-control-lg">
              <option value="0">Seleccione especialidad</option>
              @for (e of especialidades(); track e.id) {
                <option [value]="e.id">{{ e.nombre }}</option>
              }
            </select>
          </div>

          <div class="input-group">
            <label for="motivo">Motivo de consulta</label>
            <textarea id="motivo" [(ngModel)]="motivo" placeholder="Describa brevemente su motivo (opcional)" rows="3" class="form-control-lg"></textarea>
          </div>

          <button (click)="reservar()" [disabled]="especialidadId == 0" class="btn-primary">
            <i class="bi bi-calendar-check"></i> Reservar Cita
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .cita-container { max-width: 600px; margin: 0 auto; }
    h2 { font-size: 1.8rem; font-weight: 700; color: #1e293b; margin-bottom: 1.5rem; }
    .alert-error { background: #fef2f2; color: #dc2626; padding: 0.8rem 1rem; border-radius: 0.75rem; margin-bottom: 1rem; }
    .qr-section { text-align: center; background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
    .qr-canvas { margin: 1rem auto; display: block; border: 1px solid #e2e8f0; border-radius: 0.5rem; }
    .btn-pago-alternativo { display: inline-block; margin-top: 1rem; color: #2563eb; font-weight: 600; text-decoration: none; }
    .form-card { background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
    .input-group { margin-bottom: 1.2rem; }
    .input-group label { display: block; font-weight: 600; margin-bottom: 0.3rem; color: #334155; }
    .form-control-lg {
      width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 0.75rem;
      font-size: 1rem; outline: none; box-sizing: border-box;
    }
    .form-control-lg:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
    .btn-primary {
      width: 100%; padding: 0.85rem; background: #2563eb; color: white; border: none;
      border-radius: 0.75rem; font-size: 1.1rem; font-weight: 600; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class CitaMedicaComponent implements OnInit, OnDestroy {
  @ViewChild('qrCanvas', { static: false }) qrCanvas!: ElementRef<HTMLCanvasElement>

  especialidadId = 0
  motivo = ''
  especialidades = signal<Especialidad[]>([])
  error = signal('')
  token = signal('')
  svc = inject(CitaService)
  router = inject(Router)
  private pollingInterval: any

  ngOnInit() {
    this.svc.getEspecialidades().subscribe(res => this.especialidades.set(res))
  }

  ngOnDestroy() {
    clearInterval(this.pollingInterval)
  }

  reservar() {
    this.svc.crearCitaMedica(this.especialidadId, this.motivo).subscribe({
      next: (res: any) => {
        if (res.tokenPago) {
          this.token.set(res.tokenPago)
          setTimeout(() => this.generarQR(res.tokenPago), 50)
          this.iniciarPolling(res.tokenPago)
        } else {
          alert('Cita reservada con éxito')
        }
      },
      error: (e) => this.error.set(e.error?.message || 'Error')
    })
  }

  async generarQR(token: string) {
    if (this.qrCanvas && this.qrCanvas.nativeElement) {
      const url = `http://192.168.2.68:4200/usuario/pagar/${token}`
      await QRCode.toCanvas(this.qrCanvas.nativeElement, url, { width: 200 })
    }
  }

  iniciarPolling(token: string) {
    this.pollingInterval = setInterval(() => {
      this.svc.getEstadoPorTokenMedica(token).subscribe({
        next: (cita: any) => {
          if (cita && (cita.estado === 'en_espera' || cita.estado === 'atendida' || cita.pagado)) {
            clearInterval(this.pollingInterval)
            alert('Pago confirmado, serás redirigido a la fila virtual.')
            this.router.navigate(['/fila-publica'])
          }
        },
        error: () => {}
      })
    }, 3000)
  }
}