import { Component, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { MedicoService } from '../../../core/services/medico.service'

@Component({
    selector: 'app-medico-diagnostico',
    standalone: true,
    imports: [FormsModule],
    template: `
        <div class="diagnostico-container">
            <div class="page-header">
                <h2>Registrar Diagnóstico</h2>
                <p class="text-muted">Complete el formulario con la información del paciente</p>
            </div>

            <div class="card">
                <div class="card-body">
                    @if (!routeUserId) {
                        <div class="input-group mb-4">
                            <label>ID del Paciente</label>
                            <input [(ngModel)]="userId" type="number" class="form-control" placeholder="Ingrese el ID del paciente" />
                        </div>
                    } @else {
                        <div class="info-badge mb-4">
                            <i class="bi bi-person-check"></i>
                            Paciente ID: <strong>{{ routeUserId }}</strong>
                        </div>
                    }

                    <div class="form-grid">
                        <div class="input-group full-width">
                            <label>Motivo de consulta</label>
                            <textarea [(ngModel)]="diagnostico.motivoConsulta" rows="3" class="form-control" placeholder="Describa el motivo de la consulta..."></textarea>
                        </div>

                        <div class="input-group full-width">
                            <label>Síntomas</label>
                            <textarea [(ngModel)]="diagnostico.sintomas" rows="3" class="form-control" placeholder="Describa los síntomas presentados..."></textarea>
                        </div>

                        <div class="input-group full-width">
                            <label>Evaluación clínica</label>
                            <textarea [(ngModel)]="diagnostico.evaluacionClinica" rows="3" class="form-control" placeholder="Resultados de la evaluación clínica..."></textarea>
                        </div>

                        <div class="input-group">
                            <label>Diagnóstico</label>
                            <input [(ngModel)]="diagnostico.diagnostico" class="form-control" placeholder="Nombre del diagnóstico" />
                        </div>

                        <div class="input-group">
                            <label>Código CIE10</label>
                            <input [(ngModel)]="diagnostico.cie10" class="form-control" placeholder="Ej: J02.9" />
                        </div>

                        <div class="input-group full-width">
                            <label>Observaciones</label>
                            <textarea [(ngModel)]="diagnostico.observaciones" rows="2" class="form-control" placeholder="Observaciones adicionales..."></textarea>
                        </div>
                    </div>

                    @if (success()) {
                        <div class="alert-success mt-3">
                            <i class="bi bi-check-circle-fill"></i>
                            Diagnóstico registrado exitosamente
                        </div>
                    }

                    <button (click)="guardar()" class="btn-primary mt-4">
                        <i class="bi bi-save"></i> Guardar Diagnóstico
                    </button>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .diagnostico-container { max-width: 800px; margin: 0 auto; padding: 1rem 0; }
        .page-header { margin-bottom: 1.5rem; }
        .page-header h2 { font-size: 1.5rem; font-weight: 700; color: #1e293b; }
        .text-muted { color: #64748b; font-size: 0.95rem; }
        .card { background: white; border-radius: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .card-body { padding: 2rem; }
        .input-group { margin-bottom: 1rem; }
        .input-group label { display: block; font-weight: 600; margin-bottom: 0.3rem; color: #334155; font-size: 0.9rem; }
        .form-control { width: 100%; padding: 0.65rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; font-size: 0.95rem; outline: none; box-sizing: border-box; transition: border-color 0.2s; font-family: inherit; }
        .form-control:focus { border-color: #2563eb; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .full-width { grid-column: 1 / -1; }
        @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }
        .info-badge { padding: 0.75rem 1rem; background: #eff6ff; color: #2563eb; border-radius: 0.5rem; font-weight: 500; display: flex; align-items: center; gap: 0.5rem; }
        .btn-primary { padding: 0.75rem 1.5rem; background: #2563eb; color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: background 0.2s; font-size: 1rem; }
        .btn-primary:hover { background: #1d4ed8; }
        .alert-success { padding: 0.75rem 1rem; background: #f0fdf4; color: #059669; border-radius: 0.5rem; display: flex; align-items: center; gap: 0.5rem; font-weight: 500; }
        .mb-4 { margin-bottom: 1.5rem; }
        .mt-3 { margin-top: 1rem; }
        .mt-4 { margin-top: 1.5rem; }
    `]
})
export class MedicoDiagnosticoComponent {
    userId: number = 0
    diagnostico = {
        motivoConsulta: '', sintomas: '', evaluacionClinica: '',
        diagnostico: '', cie10: '', observaciones: ''
    }
    success = signal(false)
    routeUserId: number = 0
    private svc = inject(MedicoService)
    private route = inject(ActivatedRoute)

    constructor() {
        this.route.queryParams.subscribe(params => {
            if (params['userId']) this.routeUserId = +params['userId']
            this.userId = this.routeUserId
        })
    }

    guardar() {
        if (!this.userId) return alert('Ingrese ID del paciente')
        this.svc.crearDiagnostico(this.userId, this.diagnostico).subscribe(() => {
            this.success.set(true)
            this.diagnostico = { motivoConsulta: '', sintomas: '', evaluacionClinica: '', diagnostico: '', cie10: '', observaciones: '' }
        })
    }
}