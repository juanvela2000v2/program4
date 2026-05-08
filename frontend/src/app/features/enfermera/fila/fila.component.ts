import { Component, inject, signal, OnInit, computed } from '@angular/core'
import { EnfermeraService } from '../../../core/services/enfermera.service'
import { PacienteActualEnfermeriaService } from '../../../core/services/paciente-actual-enfermeria.service'
import { FormsModule } from '@angular/forms'

@Component({
    selector: 'app-enfermera-fila',
    standalone: true,
    imports: [FormsModule],
    template: `
        <div class="fila-container">
            <div class="fila-grid">
                <!-- Columna izquierda: Lista de espera -->
                <div class="card">
                    <div class="card-header">
                        <h3><i class="bi bi-people"></i> Pacientes en espera</h3>
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
                                            <small class="text-muted">{{ c.motivo || 'Sin motivo' }}</small>
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

                    <!-- Paciente en atención -->
                    @if (paciente()) {
                        <div class="card paciente-card">
                            <div class="card-header">
                                <h3><i class="bi bi-person-check"></i> Paciente en atención</h3>
                            </div>
                            <div class="card-body">
                                <div class="info-paciente">
                                    <p><strong>Nombre:</strong> {{ paciente().nombre }} {{ paciente().apellidoPaterno }}</p>
                                    <p><strong>CI:</strong> {{ paciente().ci }}</p>
                                    <p><strong>Edad:</strong> {{ paciente().edad }} años</p>
                                    <p><strong>Motivo:</strong> {{ paciente().motivo || 'No especificado' }}</p>
                                </div>

                                @if (paciente().imagen) {
                                    <div class="receta-section">
                                        <h4>Receta médica</h4>
                                        <img [src]="paciente().imagen" alt="Receta médica" class="receta-img" />
                                    </div>
                                }

                                @if (alergias().length > 0) {
                                    <div class="alergias-alert">
                                        <h4><i class="bi bi-exclamation-triangle"></i> Alergias del paciente</h4>
                                        <ul>
                                            @for (a of alergias(); track a.id) {
                                                <li>{{ a.agente }} - {{ a.tipoReaccion }} ({{ a.severidad }})</li>
                                            }
                                        </ul>
                                    </div>
                                }

                                <div class="btn-group">
                                    <button (click)="abrirDispensacion()" class="btn-dispensar">
                                        <i class="bi bi-capsule"></i> Dispensación
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

            <!-- Modal de Dispensación -->
            @if (mostrarDispensacion()) {
                <div class="modal-overlay">
                    <div class="modal-card">
                        <div class="modal-header">
                            <h3>Dispensación para {{ paciente()?.nombre }} {{ paciente()?.apellidoPaterno }}</h3>
                            <button (click)="cerrarDispensacion()" class="btn-close">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="input-group mb-3">
                                <label>Insumo</label>
                                <select [(ngModel)]="insumoSeleccionado" class="form-control">
                                    <option value="0">Seleccione un insumo</option>
                                    @for (i of insumos(); track i.id) {
                                        <option [value]="i.id">{{ i.nombre }} (Stock: {{ i.cantidad }})</option>
                                    }
                                </select>
                            </div>
                            <div class="input-group mb-3">
                                <label>Cantidad a dispensar</label>
                                <input [(ngModel)]="cantidadDispensar" type="number" min="1" class="form-control" placeholder="0" />
                            </div>
                            <div class="input-group mb-3">
                                <label>Fecha</label>
                                <input [(ngModel)]="fechaDispensacion" type="date" class="form-control" />
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button (click)="cerrarDispensacion()" class="btn-secondary">Cancelar</button>
                            <button (click)="registrarDispensacion()" [disabled]="!insumoSeleccionado || !cantidadDispensar" class="btn-primary">Registrar</button>
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
        .lista-espera { display: flex; flex-direction: column; gap: 0.5rem; }
        .item-espera { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: #f8fafc; border-radius: 0.5rem; }
        .avatar { font-size: 2rem; color: #64748b; }
        .input-group { margin-bottom: 1rem; }
        .input-group label { display: block; font-weight: 600; margin-bottom: 0.3rem; color: #334155; font-size: 0.9rem; }
        .form-control { width: 100%; padding: 0.65rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; font-size: 0.95rem; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
        .form-control:focus { border-color: #059669; }
        select.form-control { background: white; cursor: pointer; }
        .btn-primary { padding: 0.7rem 1.2rem; background: #059669; color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: background 0.2s; }
        .btn-primary:hover:not(:disabled) { background: #047857; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-secondary { padding: 0.6rem 1.2rem; background: #e2e8f0; color: #475569; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
        .w-100 { width: 100%; }
        .mb-4 { margin-bottom: 1.5rem; }
        .paciente-card .card-header { background: #f0fdf4; }
        .info-paciente p { margin-bottom: 0.4rem; color: #334155; font-size: 0.95rem; }
        .receta-section { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; }
        .receta-section h4 { font-size: 1rem; font-weight: 600; color: #334155; margin-bottom: 0.5rem; }
        .receta-img { max-width: 100%; max-height: 300px; border-radius: 0.5rem; border: 1px solid #e2e8f0; }
        .alergias-alert { margin-top: 1rem; padding: 1rem; background: #fef2f2; border: 1px solid #fecaca; border-radius: 0.5rem; color: #dc2626; }
        .alergias-alert h4 { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; font-size: 1rem; }
        .alergias-alert ul { margin: 0; padding-left: 1.2rem; }
        .btn-group { display: flex; gap: 0.5rem; margin-top: 1rem; }
        .btn-dispensar { flex: 1; padding: 0.65rem; background: #2563eb; color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; transition: background 0.2s; }
        .btn-dispensar:hover { background: #1d4ed8; }
        .btn-terminar { flex: 1; padding: 0.65rem; background: #e2e8f0; color: #475569; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; }
        .btn-terminar:hover { background: #cbd5e1; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-card { background: white; border-radius: 1rem; width: 90%; max-width: 450px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid #e2e8f0; }
        .modal-header h3 { font-size: 1.2rem; font-weight: 600; color: #1e293b; }
        .btn-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #94a3b8; }
        .modal-body { padding: 1.5rem; }
        .modal-footer { padding: 1.5rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; gap: 0.7rem; }
        .mb-3 { margin-bottom: 1rem; }
    `]
})
export class EnfermeraFilaComponent implements OnInit {
    fila = signal<any[]>([])
    salas = signal<any[]>([])
    insumos = signal<any[]>([])
    alergias = signal<any[]>([])
    salaId: number | string = ''
    paciente = computed(() => this.pacienteSvc.getPaciente())

    mostrarDispensacion = signal(false)
    insumoSeleccionado: number = 0
    cantidadDispensar: number = 0
    fechaDispensacion: string = new Date().toISOString().split('T')[0]

    private svc = inject(EnfermeraService)
    private pacienteSvc = inject(PacienteActualEnfermeriaService)

    ngOnInit() { this.cargar() }

    cargar() {
        this.svc.getFila().subscribe(res => this.fila.set(res))
        this.svc.getSalas().subscribe(res => this.salas.set(res))
        this.svc.getInsumos().subscribe(res => this.insumos.set(res))
    }

    atender() {
        this.svc.atenderSiguiente(+this.salaId).subscribe({
            next: (res: any) => {
                if (res && res.user) {
                    this.pacienteSvc.setPaciente({
                        userId: res.user.id, nombre: res.user.nombre, apellidoPaterno: res.user.apellidoPaterno,
                        ci: res.user.ci, edad: this.calcularEdad(res.user.fechaNacimiento), motivo: res.motivo,
                        imagen: res.imagen ? `http://192.168.2.68:3000/uploads/${res.imagen}` : null
                    })
                    this.svc.getAlergias(res.user.id).subscribe(al => this.alergias.set(al))
                } else {
                    alert('No hay pacientes en espera')
                }
                this.cargar()
            },
            error: () => alert('Error al atender')
        })
    }

    terminarConsulta() { this.pacienteSvc.limpiar(); this.alergias.set([]) }

    abrirDispensacion() { this.insumoSeleccionado = 0; this.cantidadDispensar = 0; this.fechaDispensacion = new Date().toISOString().split('T')[0]; this.mostrarDispensacion.set(true) }

    cerrarDispensacion() { this.mostrarDispensacion.set(false) }

    registrarDispensacion() {
        const paciente = this.paciente()
        if (!paciente || !paciente.userId) return
        this.svc.dispensar(paciente.userId, this.insumoSeleccionado, this.cantidadDispensar, this.fechaDispensacion)
            .subscribe({
                next: () => { alert('Dispensación registrada'); this.cerrarDispensacion(); this.cargar() },
                error: (err) => alert(err.error?.message || 'Error al dispensar')
            })
    }

    calcularEdad(fechaNacimiento: string): number {
        if (!fechaNacimiento) return 0
        const hoy = new Date()
        const nacimiento = new Date(fechaNacimiento)
        let edad = hoy.getFullYear() - nacimiento.getFullYear()
        const mes = hoy.getMonth() - nacimiento.getMonth()
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--
        return edad
    }
}