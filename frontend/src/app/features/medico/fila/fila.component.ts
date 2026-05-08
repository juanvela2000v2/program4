import { Component, inject, signal, OnInit, computed } from '@angular/core'
import { MedicoService } from '../../../core/services/medico.service'
import { PacienteActualService } from '../../../core/services/paciente-actual.service'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'

@Component({
    selector: 'app-medico-fila',
    standalone: true,
    imports: [FormsModule, RouterLink],
    template: `
        <div class="fila-container">
            <div class="fila-grid">
                <!-- Columna izquierda: Lista de espera -->
                <div class="card">
                    <div class="card-header">
                        <h3><i class="bi bi-people-fill"></i> Pacientes en espera</h3>
                    </div>
                    <div class="card-body">
                        @if (fila().length === 0) {
                            <p class="text-muted text-center py-4">No hay pacientes en espera</p>
                        } @else {
                            <div class="lista-espera">
                                @for (c of fila(); track c.id) {
                                    <div class="item-espera">
                                        <div class="avatar">
                                            <i class="bi bi-person-circle"></i>
                                        </div>
                                        <div>
                                            <strong>{{ c.user?.nombre }} {{ c.user?.apellidoPaterno }}</strong>
                                            <br/>
                                            <small class="text-muted">{{ c.especialidad?.nombre || 'Sin especialidad' }}</small>
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>

                <!-- Columna derecha: Acciones -->
                <div>
                    <!-- Selección de sala -->
                    <div class="card mb-4">
                        <div class="card-header">
                            <h3><i class="bi bi-door-open"></i> Atender paciente</h3>
                        </div>
                        <div class="card-body">
                            <div class="input-group mb-3">
                                <label>Seleccionar sala</label>
                                <select [(ngModel)]="salaId" class="form-control">
                                    <option value="">-- Elija una sala --</option>
                                    @for (s of salas(); track s.id) {
                                        <option [value]="s.id">{{ s.nombre }}</option>
                                    }
                                </select>
                            </div>
                            <button (click)="atender()" [disabled]="!salaId || paciente() != null" class="btn-primary w-100">
                                <i class="bi bi-arrow-right-circle"></i> Atender siguiente paciente
                            </button>
                        </div>
                    </div>

                    <!-- Paciente en consulta -->
                    @if (paciente()) {
                        <div class="card paciente-card">
                            <div class="card-header">
                                <h3><i class="bi bi-person-check-fill"></i> Paciente en consulta</h3>
                            </div>
                            <div class="card-body">
                                <div class="info-paciente">
                                    <p><strong>Nombre:</strong> {{ paciente().nombre }} {{ paciente().apellidoPaterno }}</p>
                                    <p><strong>CI:</strong> {{ paciente().ci }}</p>
                                    <p><strong>Edad:</strong> {{ calcularEdad(paciente().fechaNacimiento) }} años</p>
                                    <p><strong>Motivo:</strong> {{ paciente().motivo || 'No especificado' }}</p>
                                </div>

                                <div class="btn-group">
                                    <a [routerLink]="['/medico/diagnostico']" [queryParams]="{ userId: paciente().userId, ci: paciente().ci }" class="btn-action">
                                        <i class="bi bi-clipboard2-pulse"></i> Diagnóstico
                                    </a>
                                    <a [routerLink]="['/medico/receta']" [queryParams]="{ userId: paciente().userId, ci: paciente().ci }" class="btn-action">
                                        <i class="bi bi-prescription2"></i> Receta
                                    </a>
                                    <a [routerLink]="['/medico/historial']" [queryParams]="{ ci: paciente().ci }" class="btn-action">
                                        <i class="bi bi-clock-history"></i> Historial
                                    </a>
                                </div>

                                <div class="btn-group mt-3">
                                    <button (click)="abrirModalAlergia()" class="btn-alergia">
                                        <i class="bi bi-shield-exclamation"></i> Registrar Alergia
                                    </button>
                                    <button (click)="terminarConsulta()" class="btn-terminar">
                                        <i class="bi bi-check-circle"></i> Terminar consulta
                                    </button>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>

            <!-- Modal de Alergia -->
            @if (mostrarModalAlergia()) {
                <div class="modal-overlay">
                    <div class="modal-card">
                        <div class="modal-header">
                            <h3>Registrar Alergia</h3>
                            <button (click)="cerrarModalAlergia()" class="btn-close">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="input-group">
                                <label>Agente Alergénico</label>
                                <input [(ngModel)]="alergiaForm.agente" class="form-control" placeholder="Ej: Penicilina, Látex..." />
                            </div>
                            <div class="input-group">
                                <label>Tipo de Reacción</label>
                                <input [(ngModel)]="alergiaForm.tipoReaccion" class="form-control" placeholder="Ej: Anafilaxia, Urticaria..." />
                            </div>
                            <div class="form-grid">
                                <div class="input-group">
                                    <label>Severidad</label>
                                    <select [(ngModel)]="alergiaForm.severidad" class="form-control">
                                        <option value="leve">Leve</option>
                                        <option value="moderada">Moderada</option>
                                        <option value="severa">Severa</option>
                                    </select>
                                </div>
                                <div class="input-group">
                                    <label>Estatus</label>
                                    <select [(ngModel)]="alergiaForm.estatus" class="form-control">
                                        <option value="activa">Activa</option>
                                        <option value="inactiva">Inactiva</option>
                                    </select>
                                </div>
                            </div>
                            <div class="input-group">
                                <label>Fuente</label>
                                <input [(ngModel)]="alergiaForm.fuente" class="form-control" placeholder="Ej: Paciente, Familiar..." />
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button (click)="cerrarModalAlergia()" class="btn-secondary">Cancelar</button>
                            <button (click)="guardarAlergia()" [disabled]="!alergiaForm.agente" class="btn-primary">Guardar</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    `,
    styles: [`
        .fila-container { padding: 1rem 0; }
        .fila-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; align-items: start; }
        @media (max-width: 900px) { .fila-grid { grid-template-columns: 1fr; } }
        .card { background: white; border-radius: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04); overflow: hidden; }
        .card-header { padding: 1rem 1.5rem; border-bottom: 1px solid #e2e8f0; background: #f8fafc; }
        .card-header h3 { font-size: 1.1rem; font-weight: 600; color: #334155; display: flex; align-items: center; gap: 0.5rem; margin: 0; }
        .card-body { padding: 1.5rem; }
        .text-muted { color: #94a3b8; }
        .text-center { text-align: center; }
        .py-4 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
        .lista-espera { display: flex; flex-direction: column; gap: 0.5rem; }
        .item-espera { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: #f8fafc; border-radius: 0.5rem; }
        .avatar { font-size: 2rem; color: #64748b; }
        .input-group { margin-bottom: 1rem; }
        .input-group label { display: block; font-weight: 600; margin-bottom: 0.3rem; color: #334155; font-size: 0.9rem; }
        .form-control { width: 100%; padding: 0.65rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; font-size: 0.95rem; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
        .form-control:focus { border-color: #2563eb; }
        select.form-control { background: white; cursor: pointer; }
        .btn-primary { padding: 0.7rem 1.2rem; background: #2563eb; color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: background 0.2s; }
        .btn-primary:hover:not(:disabled) { background: #1d4ed8; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-secondary { padding: 0.6rem 1.2rem; background: #e2e8f0; color: #475569; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
        .w-100 { width: 100%; }
        .mb-4 { margin-bottom: 1.5rem; }
        .mb-3 { margin-bottom: 1rem; }
        .mt-3 { margin-top: 1rem; }
        .paciente-card .card-header { background: #eff6ff; }
        .info-paciente p { margin-bottom: 0.4rem; color: #334155; font-size: 0.95rem; }
        .btn-group { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
        .btn-action { padding: 0.6rem; background: #eff6ff; color: #2563eb; border-radius: 0.5rem; text-decoration: none; font-weight: 600; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; gap: 0.4rem; transition: background 0.2s; }
        .btn-action:hover { background: #dbeafe; }
        .btn-alergia { flex: 1; padding: 0.65rem; background: #fef3c7; color: #b45309; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; transition: background 0.2s; }
        .btn-alergia:hover { background: #fde68a; }
        .btn-terminar { flex: 1; padding: 0.65rem; background: #e2e8f0; color: #475569; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; }
        .btn-terminar:hover { background: #cbd5e1; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-card { background: white; border-radius: 1rem; width: 90%; max-width: 500px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid #e2e8f0; }
        .modal-header h3 { font-size: 1.2rem; font-weight: 600; color: #1e293b; margin: 0; }
        .btn-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #94a3b8; }
        .modal-body { padding: 1.5rem; }
        .modal-footer { padding: 1.5rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; gap: 0.7rem; }
    `]
})
export class MedicoFilaComponent implements OnInit {
    fila = signal<any[]>([])
    salas = signal<any[]>([])
    salaId: number | string = ''

    paciente = computed(() => this.pacienteSvc.getPaciente())

    mostrarModalAlergia = signal(false)
    alergiaForm = { agente: '', tipoReaccion: '', severidad: 'moderada', estatus: 'activa', fuente: '' }

    private svc = inject(MedicoService)
    private pacienteSvc = inject(PacienteActualService)

    ngOnInit() { this.cargar() }

    cargar() {
        this.svc.getFila().subscribe(res => this.fila.set(res))
        this.svc.getSalas().subscribe(res => this.salas.set(res))
    }

    atender() {
        this.svc.atenderSiguiente(+this.salaId).subscribe({
            next: (res: any) => {
                if (res && res.user) {
                    this.pacienteSvc.setPaciente({
                        userId: res.user.id,
                        ci: res.user.ci,
                        nombre: res.user.nombre,
                        apellidoPaterno: res.user.apellidoPaterno,
                        fechaNacimiento: res.user.fechaNacimiento,
                        motivo: res.motivo
                    })
                } else {
                    alert('No hay pacientes en espera')
                }
                this.cargar()
            },
            error: () => alert('Error al atender')
        })
    }

    terminarConsulta() { this.pacienteSvc.limpiar() }

    calcularEdad(fechaNacimiento: string): number {
        if (!fechaNacimiento) return 0
        const hoy = new Date()
        const nacimiento = new Date(fechaNacimiento)
        let edad = hoy.getFullYear() - nacimiento.getFullYear()
        const mes = hoy.getMonth() - nacimiento.getMonth()
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--
        return edad
    }

    abrirModalAlergia() {
        this.alergiaForm = { agente: '', tipoReaccion: '', severidad: 'moderada', estatus: 'activa', fuente: '' }
        this.mostrarModalAlergia.set(true)
    }

    cerrarModalAlergia() { this.mostrarModalAlergia.set(false) }

    guardarAlergia() {
        const pac = this.paciente()
        if (!pac) return
        this.svc.registrarAlergia({ ...this.alergiaForm, pacienteId: pac.userId }).subscribe({
            next: () => { alert('Alergia registrada'); this.cerrarModalAlergia() },
            error: () => alert('Error al registrar alergia')
        })
    }
}