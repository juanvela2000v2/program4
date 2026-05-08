import { Component, inject } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { CitaService } from "../../../core/services/cita.service"

@Component({
  selector: 'app-pagar',
  template: `
    <div class="pagar-container">
      <h2>Confirmar Pago</h2>
      <div class="card-pago">
        <p class="token-label">Token de pago</p>
        <p class="token-value">{{ token }}</p>
        <button (click)="confirmar()" class="btn-confirmar">
          <i class="bi bi-shield-check"></i> Confirmar Pago
        </button>
      </div>
    </div>
  `,
  styles: [`
    .pagar-container { max-width: 500px; margin: 2rem auto; }
    h2 { font-size: 1.8rem; font-weight: 700; color: #1e293b; margin-bottom: 1.5rem; }
    .card-pago {
      background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      text-align: center;
    }
    .token-label { color: #64748b; margin-bottom: 0.5rem; }
    .token-value { font-size: 2rem; font-weight: 700; color: #1e293b; letter-spacing: 2px; margin-bottom: 2rem; }
    .btn-confirmar {
      padding: 0.85rem 2rem; background: #16a34a; color: white; border: none;
      border-radius: 0.75rem; font-size: 1.1rem; font-weight: 600; cursor: pointer;
      display: inline-flex; align-items: center; gap: 0.5rem;
    }
    .btn-confirmar:hover { background: #15803d; }
  `],
  standalone: true
})
export class PagarComponent {
  token = ''
  svc = inject(CitaService)
  route = inject(ActivatedRoute)
  router = inject(Router)

  constructor() {
    this.token = this.route.snapshot.paramMap.get('token') || ''
  }

  confirmar() {
    this.svc.confirmarPago(this.token).subscribe({
      next: () => {
        alert('Pago confirmado')
        this.router.navigate(['/fila-publica'])
      },
      error: () => alert('Error al confirmar')
    })
  }
}