import { Component, inject, signal, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { MedicoService } from '../../../core/services/medico.service'

@Component({
    selector: 'app-medico-historial',
    standalone: true,
    imports: [FormsModule],
    template: `
        <div class="historial-container">
            <div class="page-header">
                <h2>Historial Clínico</h2>
                <p class="text-muted">Busque el historial médico de un paciente por CI</p>
            </div>

            <!-- Buscador -->
            <div class="search-card">
                <div class="search-row">
                    <div class="input-group">
                        <label>CI del Paciente</label>
                        <input [(ngModel)]="ci" class="form-control" placeholder="Ingrese el carnet de identidad" />
                    </div>
                    <button (click)="buscar()" class="btn-search">
                        <i class="bi bi-search"></i> Buscar
                    </button>
                </div>
            </div>

            @if (historial()) {
                <!-- Datos del paciente -->
                <div class="paciente-header">
                    <div class="paciente-avatar">
                        <i class="bi bi-person-circle"></i>
                    </div>
                    <div>
                        <h3>{{ historial().paciente.nombre }} {{ historial().paciente.apellidoPaterno }} {{ historial().paciente.apellidoMaterno }}</h3>
                        <p class="text-muted">CI: {{ historial().paciente.ci }} | Sexo: {{ historial().paciente.sexo }} | Fecha Nac: {{ historial().paciente.fechaNacimiento }}</p>
                    </div>
                </div>

                <!-- Alergias -->
                @if (historial().alergias?.length) {
                    <div class="alergias-section">
                        <h4><i class="bi bi-exclamation-triangle-fill"></i> Historial de Alergias</h4>
                        <div class="alergias-list">
                            @for (a of historial().alergias; track a.id) {
                                <div class="alergia-item">
                                    <strong>{{ a.agente }}</strong>
                                    <span class="badge badge-severidad" [class.badge-leve]="a.severidad === 'leve'" [class.badge-moderada]="a.severidad === 'moderada'" [class.badge-severa]="a.severidad === 'severa'">
                                        {{ a.severidad }}
                                    </span>
                                    <p class="text-muted small">{{ a.tipoReaccion }} | Estatus: {{ a.estatus }} | Fuente: {{ a.fuente }}</p>
                                </div>
                            }
                        </div>
                    </div>
                }

                <!-- Diagnósticos -->
                <h4 class="section-title">Diagnósticos</h4>
                @for (d of historial().diagnosticos; track d.id) {
                    <div class="card-documento">
                        <div class="documento-header">
                            <h5>DIAGNÓSTICO MÉDICO</h5>
                            <span class="text-muted small">{{ d.fecha }}</span>
                        </div>
                        <div class="documento-body">
                            <p><strong>Médico:</strong> Dr. {{ d.medico?.nombre }} {{ d.medico?.apellidoPaterno }}</p>
                            <hr/>
                            <p><strong>MOTIVO DE CONSULTA</strong></p>
                            <p>{{ d.motivoConsulta }}</p>
                            <p><strong>SÍNTOMAS</strong></p>
                            <p>{{ d.sintomas }}</p>
                            <p><strong>EVALUACIÓN CLÍNICA</strong></p>
                            <p>{{ d.evaluacionClinica }}</p>
                            <p><strong>DIAGNÓSTICO</strong></p>
                            <p>{{ d.diagnostico }} @if (d.cie10) { <span class="badge-cie">CIE10: {{ d.cie10 }}</span> }</p>
                            <p><strong>OBSERVACIONES</strong></p>
                            <p>{{ d.observaciones || 'Sin observaciones' }}</p>
                        </div>
                    </div>
                }

                <!-- Recetas -->
                <h4 class="section-title">Recetas Médicas</h4>
                @for (r of historial().recetas; track r.id) {
                    <div class="card-documento receta">
                        <div class="documento-header">
                            <h5>RECETA MÉDICA</h5>
                            <span class="text-muted small">{{ r.fecha }}</span>
                        </div>
                        <div class="documento-body">
                            <p><strong>Médico:</strong> Dr. {{ r.medico?.nombre }} {{ r.medico?.apellidoPaterno }}</p>
                            <hr/>
                            <div class="receta-grid">
                                <div><strong>Medicamento:</strong> {{ r.medicamento }}</div>
                                <div><strong>Dosis:</strong> {{ r.dosis }}</div>
                                <div><strong>Frecuencia:</strong> {{ r.frecuencia }}</div>
                                <div><strong>Duración:</strong> {{ r.duracion }}</div>
                            </div>
                            <p class="mt-2"><strong>Instrucciones:</strong> {{ r.instrucciones || 'Sin instrucciones adicionales' }}</p>
                        </div>
                    </div>
                }
            }
        </div>
    `,
    styles: [`
        .historial-container { max-width: 900px; margin: 0 auto; padding: 1rem 0; }
        .page-header { margin-bottom: 1.5rem; }
        .page-header h2 { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 0.3rem; }
        .text-muted { color: #64748b; font-size: 0.9rem; }
        .small { font-size: 0.85rem; }
        .search-card { background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04); margin-bottom: 1.5rem; }
        .search-row { display: flex; gap: 1rem; align-items: end; }
        .input-group { flex: 1; }
        .input-group label { display: block; font-weight: 600; margin-bottom: 0.3rem; color: #334155; font-size: 0.9rem; }
        .form-control { width: 100%; padding: 0.65rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; font-size: 0.95rem; outline: none; box-sizing: border-box; }
        .form-control:focus { border-color: #2563eb; }
        .btn-search { padding: 0.65rem 1.5rem; background: #2563eb; color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; }
        .btn-search:hover { background: #1d4ed8; }
        .paciente-header { display: flex; align-items: center; gap: 1rem; background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04); margin-bottom: 1.5rem; }
        .paciente-avatar { font-size: 3rem; color: #2563eb; }
        .paciente-header h3 { font-size: 1.3rem; font-weight: 700; color: #1e293b; margin-bottom: 0.2rem; }
        .alergias-section { background: #fef2f2; border: 1px solid #fecaca; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1.5rem; }
        .alergias-section h4 { color: #dc2626; font-size: 1.1rem; font-weight: 600; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
        .alergias-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .alergia-item { background: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid #fee2e2; }
        .alergia-item p { margin-top: 0.3rem; }
        .badge-severidad { padding: 0.15rem 0.5rem; border-radius: 0.3rem; font-size: 0.8rem; font-weight: 600; margin-left: 0.5rem; }
        .badge-leve { background: #fef3c7; color: #b45309; }
        .badge-moderada { background: #fed7aa; color: #c2410c; }
        .badge-severa { background: #fee2e2; color: #dc2626; }
        .section-title { font-size: 1.2rem; font-weight: 700; color: #1e293b; margin: 1.5rem 0 1rem; }
        .card-documento { background: white; border-radius: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04); margin-bottom: 1rem; overflow: hidden; }
        .card-documento.receta { border-left: 4px solid #059669; }
        .documento-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
        .documento-header h5 { font-size: 0.95rem; font-weight: 700; color: #1e293b; margin: 0; }
        .documento-body { padding: 1.5rem; }
        .documento-body p { margin-bottom: 0.5rem; color: #334155; }
        hr { border: none; border-top: 1px solid #e2e8f0; margin: 0.75rem 0; }
        .badge-cie { padding: 0.15rem 0.5rem; background: #eff6ff; color: #2563eb; border-radius: 0.3rem; font-size: 0.8rem; font-weight: 600; }
        .receta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
        .mt-2 { margin-top: 0.75rem; }
        @media (max-width: 600px) {
            .search-row { flex-direction: column; }
            .receta-grid { grid-template-columns: 1fr; }
        }
    `]
})
export class MedicoHistorialComponent implements OnInit {
    ci: string = ''
    historial = signal<any>(null)
    private svc = inject(MedicoService)
    private route = inject(ActivatedRoute)

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['ci']) {
                this.ci = params['ci']
                this.buscar()
            }
        })
    }

    buscar() {
        if (!this.ci) return
        this.svc.getHistorial(this.ci).subscribe({
            next: (res) => this.historial.set(res),
            error: () => alert('Paciente no encontrado')
        })
    }
}