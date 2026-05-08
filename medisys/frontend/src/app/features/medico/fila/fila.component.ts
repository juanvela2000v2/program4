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
        <h2>Fila Virtual de Citas Médicas</h2>
        <h3>Pacientes en espera</h3>
        <ul>
            @for(c of fila(); track c.id){
                <li>{{c.user?.nombre}} {{c.user?.apellidoPaterno}} - {{c.especialidad?.nombre}}</li>
            }
        </ul>
        <div>
            <label>Seleccionar sala:</label>
            <select [(ngModel)]="salaId">
                <option value="">-- Elija sala --</option>
                @for(s of salas(); track s.id){
                    <option [value]="s.id">{{s.nombre}}</option>
                }
            </select>
            <button (click)="atender()" [disabled]="!salaId || paciente() != null">
                Atender siguiente paciente
            </button>
        </div>

        @if (paciente()) {
            <div style="margin-top: 20px; border: 1px solid #ccc; padding: 10px;">
                <h3>Paciente en consulta</h3>
                <p>Nombre: {{ paciente().nombre }} {{ paciente().apellidoPaterno }}</p>
                <p>CI: {{ paciente().ci }}</p>
                <p>Edad: {{ calcularEdad(paciente().fechaNacimiento) }} años</p>
                <p>Motivo: {{ paciente().motivo }}</p>
                <nav>
                    <a [routerLink]="['/medico/diagnostico']" [queryParams]="{ userId: paciente().userId, ci: paciente().ci }">Crear Diagnóstico</a> |
                    <a [routerLink]="['/medico/receta']" [queryParams]="{ userId: paciente().userId, ci: paciente().ci }">Crear Receta</a> |
                    <a [routerLink]="['/medico/historial']" [queryParams]="{ ci: paciente().ci }">Ver Historial Clínico</a>
                </nav>
                <button (click)="abrirModalAlergia()" style="margin-right: 5px; margin-top: 5px;">Registrar Alergia</button>
                <button (click)="terminarConsulta()" style="margin-top: 5px;">Terminar consulta</button>
            </div>
        }

        @if (mostrarModalAlergia()) {
            <div class="modal d-block" style="background: rgba(0,0,0,0.5)">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5>Registrar Alergia</h5>
                            <button (click)="cerrarModalAlergia()" class="btn-close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3"><label>Agente Alergénico</label><input [(ngModel)]="alergiaForm.agente" class="form-control" /></div>
                            <div class="mb-3"><label>Tipo de Reacción</label><input [(ngModel)]="alergiaForm.tipoReaccion" class="form-control" /></div>
                            <div class="mb-3"><label>Severidad</label>
                                <select [(ngModel)]="alergiaForm.severidad" class="form-select">
                                    <option value="leve">Leve</option>
                                    <option value="moderada">Moderada</option>
                                    <option value="severa">Severa</option>
                                </select>
                            </div>
                            <div class="mb-3"><label>Estatus</label>
                                <select [(ngModel)]="alergiaForm.estatus" class="form-select">
                                    <option value="activa">Activa</option>
                                    <option value="inactiva">Inactiva</option>
                                </select>
                            </div>
                            <div class="mb-3"><label>Fuente</label><input [(ngModel)]="alergiaForm.fuente" class="form-control" /></div>
                        </div>
                        <div class="modal-footer">
                            <button (click)="cerrarModalAlergia()" class="btn btn-secondary">Cancelar</button>
                            <button (click)="guardarAlergia()" [disabled]="!alergiaForm.agente" class="btn btn-primary">Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
        }
    `
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

    ngOnInit() {
        this.cargar()
    }

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

    terminarConsulta() {
        this.pacienteSvc.limpiar()
    }

    calcularEdad(fechaNacimiento: string): number {
        if (!fechaNacimiento) return 0
        const hoy = new Date()
        const nacimiento = new Date(fechaNacimiento)
        let edad = hoy.getFullYear() - nacimiento.getFullYear()
        const mes = hoy.getMonth() - nacimiento.getMonth()
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--
        }
        return edad
    }

    abrirModalAlergia() {
        this.alergiaForm = { agente: '', tipoReaccion: '', severidad: 'moderada', estatus: 'activa', fuente: '' }
        this.mostrarModalAlergia.set(true)
    }

    cerrarModalAlergia() {
        this.mostrarModalAlergia.set(false)
    }

    guardarAlergia() {
        const pac = this.paciente()
        if (!pac) return
        this.svc.registrarAlergia({ ...this.alergiaForm, pacienteId: pac.userId }).subscribe({
            next: () => {
                alert('Alergia registrada')
                this.cerrarModalAlergia()
            },
            error: () => alert('Error al registrar alergia')
        })
    }
}