import { Component, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { MedicoService } from '../../../core/services/medico.service'

@Component({
    selector: 'app-medico-receta',
    standalone: true,
    imports: [FormsModule],
    template: `
        <div class="receta-container">
            <div class="page-header">
                <h2>Crear Receta Médica</h2>
                <p class="text-muted">Complete los datos para generar la receta</p>
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
                            Paciente: <strong>{{ pacienteNombre || 'ID: ' + routeUserId }}</strong>
                        </div>
                    }

                    <div class="form-grid">
                        <div class="input-group full-width">
                            <label>Medicamento</label>
                            <input [(ngModel)]="receta.medicamento" class="form-control" placeholder="Nombre del medicamento" />
                        </div>

                        <div class="input-group">
                            <label>Dosis</label>
                            <input [(ngModel)]="receta.dosis" class="form-control" placeholder="Ej: 500mg, 10ml..." />
                        </div>

                        <div class="input-group">
                            <label>Frecuencia</label>
                            <input [(ngModel)]="receta.frecuencia" class="form-control" placeholder="Ej: Cada 8 horas, 1 vez al día..." />
                        </div>

                        <div class="input-group">
                            <label>Duración</label>
                            <input [(ngModel)]="receta.duracion" class="form-control" placeholder="Ej: 7 días, 2 semanas..." />
                        </div>

                        <div class="input-group">
                            <label>Fecha</label>
                            <input [(ngModel)]="receta.fecha" type="date" class="form-control" />
                        </div>

                        <div class="input-group full-width">
                            <label>Instrucciones adicionales</label>
                            <textarea [(ngModel)]="receta.instrucciones" rows="3" class="form-control" placeholder="Instrucciones especiales para el paciente..."></textarea>
                        </div>
                    </div>

                    @if (recetaCreada()) {
                        <div class="alert-success mt-3">
                            <i class="bi bi-check-circle-fill"></i>
                            Receta creada exitosamente
                        </div>
                    }

                    <div class="btn-group mt-4">
                        <button (click)="guardar()" class="btn-primary">
                            <i class="bi bi-save"></i> Guardar Receta
                        </button>
                        <button (click)="imprimir()" [disabled]="!recetaCreada()" class="btn-print">
                            <i class="bi bi-printer"></i> Imprimir Receta
                        </button>
                    </div>

                    <!-- Vista previa de impresión -->
                    @if (recetaCreada()) {
                        <div class="preview-card mt-4">
                            <h4>Vista previa de la receta</h4>
                            <div class="receta-preview">
                                <h3>RECETA MÉDICA</h3>
                                <p><strong>Paciente:</strong> {{ pacienteNombre || 'No especificado' }}</p>
                                <p><strong>Fecha:</strong> {{ receta.fecha }}</p>
                                <hr/>
                                <div class="preview-grid">
                                    <p><strong>Medicamento:</strong> {{ receta.medicamento }}</p>
                                    <p><strong>Dosis:</strong> {{ receta.dosis }}</p>
                                    <p><strong>Frecuencia:</strong> {{ receta.frecuencia }}</p>
                                    <p><strong>Duración:</strong> {{ receta.duracion }}</p>
                                </div>
                                <p><strong>Instrucciones:</strong> {{ receta.instrucciones || 'Sin instrucciones adicionales' }}</p>
                            </div>
                        </div>
                    }
                </div>
            </div>

            <!-- Div oculto para impresión -->
            @if (recetaCreada()) {
                <div id="receta-impresa" style="display:none">
                    <h3>RECETA MÉDICA</h3>
                    <p>Paciente: {{ pacienteNombre }}</p>
                    <p>Fecha: {{ receta.fecha }}</p>
                    <p>Médico: Dr. {{ medicoNombre }}</p>
                    <hr/>
                    <p>Medicamento: {{ receta.medicamento }}</p>
                    <p>Dosis: {{ receta.dosis }}</p>
                    <p>Frecuencia: {{ receta.frecuencia }}</p>
                    <p>Duración: {{ receta.duracion }}</p>
                    <p>Instrucciones: {{ receta.instrucciones }}</p>
                </div>
            }
        </div>
    `,
    styles: [`
        .receta-container { max-width: 800px; margin: 0 auto; padding: 1rem 0; }
        .page-header { margin-bottom: 1.5rem; }
        .page-header h2 { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 0.3rem; }
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
        .btn-group { display: flex; gap: 0.75rem; }
        .btn-primary { padding: 0.75rem 1.5rem; background: #2563eb; color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: background 0.2s; flex: 1; justify-content: center; }
        .btn-primary:hover { background: #1d4ed8; }
        .btn-print { padding: 0.75rem 1.5rem; background: #059669; color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: background 0.2s; flex: 1; justify-content: center; }
        .btn-print:hover:not(:disabled) { background: #047857; }
        .btn-print:disabled { opacity: 0.5; cursor: not-allowed; }
        .alert-success { padding: 0.75rem 1rem; background: #f0fdf4; color: #059669; border-radius: 0.5rem; display: flex; align-items: center; gap: 0.5rem; font-weight: 500; }
        .preview-card { border: 2px solid #e2e8f0; border-radius: 0.75rem; padding: 1.5rem; }
        .preview-card h4 { font-size: 1rem; font-weight: 600; color: #64748b; margin-bottom: 1rem; }
        .receta-preview { padding: 1rem; background: #fafafa; border-radius: 0.5rem; }
        .receta-preview h3 { font-size: 1.2rem; font-weight: 700; color: #1e293b; margin-bottom: 0.75rem; }
        .receta-preview p { margin-bottom: 0.3rem; color: #334155; }
        .preview-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin: 0.5rem 0; }
        hr { border: none; border-top: 1px solid #d1d5db; margin: 0.5rem 0; }
        .mb-4 { margin-bottom: 1.5rem; }
        .mt-3 { margin-top: 1rem; }
        .mt-4 { margin-top: 1.5rem; }
    `]
})
export class MedicoRecetaComponent {
    userId: number = 0
    receta = {
        medicamento: '', dosis: '', frecuencia: '', duracion: '',
        instrucciones: '', fecha: new Date().toISOString().split('T')[0]
    }
    recetaCreada = signal(false)
    pacienteNombre: string = ''
    medicoNombre: string = ''
    routeUserId: number = 0
    private svc = inject(MedicoService)
    private route = inject(ActivatedRoute)

    constructor() {
        this.route.queryParams.subscribe(params => {
            if (params['userId']) this.routeUserId = +params['userId']
            this.userId = this.routeUserId
            if (params['ci']) this.pacienteNombre = params['ci']
        })
    }

    guardar() {
        if (!this.userId) return alert('Ingrese ID del paciente')
        this.svc.crearReceta({ ...this.receta, userId: this.userId }).subscribe(() => {
            this.recetaCreada.set(true)
        })
    }

    imprimir() {
        const contenido = document.getElementById('receta-impresa')?.innerHTML
        const ventana = window.open('', '', 'width=600,height=400')
        if (ventana && contenido) {
            ventana.document.write('<html><head><title>Receta Médica</title><style>body{font-family:Arial,sans-serif;padding:2rem}h3{text-align:center}hr{margin:1rem 0}p{margin:0.5rem 0}</style></head><body>')
            ventana.document.write(contenido)
            ventana.document.write('</body></html>')
            ventana.document.close()
            ventana.print()
        }
    }
}