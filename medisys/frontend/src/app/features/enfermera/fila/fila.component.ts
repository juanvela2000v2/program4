import { Component, inject, signal, OnInit, computed } from '@angular/core'
import { EnfermeraService } from '../../../core/services/enfermera.service'
import { PacienteActualEnfermeriaService } from '../../../core/services/paciente-actual-enfermeria.service'
import { FormsModule } from '@angular/forms'

@Component({
    selector: 'app-enfermera-fila',
    standalone: true,
    imports: [FormsModule],
    template: `
        <h2>Fila Virtual de Enfermería</h2>
        <h3>Pacientes en espera</h3>
        <ul>
            @for(c of fila(); track c.id){
                <li>{{c.user?.nombre}} {{c.user?.apellidoPaterno}}</li>
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
                <h3>Paciente en atención</h3>
                <p>Nombre: {{ paciente().nombre }} {{ paciente().apellidoPaterno }}</p>
                <p>CI: {{ paciente().ci }}</p>
                <p>Edad: {{ paciente().edad }} años</p>
                <p>Motivo: {{ paciente().motivo }}</p>
                                @if (paciente().imagen) {
                    <div style="margin-top: 10px;">
                        <strong>Receta médica:</strong>
                        <br/>
                        <img [src]="paciente().imagen" 
                            alt="Receta médica del paciente" 
                            style="max-width: 100%; max-height: 400px; border: 1px solid #ccc; margin-top: 5px; border-radius: 8px;" />
                    </div>
                }
                @if (alergias().length) {
                    <div style="color: red; border: 1px solid red; padding: 5px; margin-bottom: 5px;">
                        <strong>Alergias del paciente:</strong>
                        <ul>
                            @for(a of alergias(); track a.id){
                                <li>{{ a.agente }} - {{ a.tipoReaccion }} ({{ a.severidad }})</li>
                            }
                        </ul>
                    </div>
                }
                <button (click)="abrirDispensacion()" style="margin-right: 5px;">Dispensación</button>
                <button (click)="terminarConsulta()">Terminar consulta</button>
            </div>
        }

        <!-- Modal de Dispensación -->
        @if (mostrarDispensacion()) {
            <div class="modal d-block" style="background: rgba(0,0,0,0.5)">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5>Dispensación para {{ paciente()?.nombre }} {{ paciente()?.apellidoPaterno }}</h5>
                            <button (click)="cerrarDispensacion()" class="btn-close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label>Insumo:</label>
                                <select [(ngModel)]="insumoSeleccionado" class="form-select">
                                    <option value="0">Seleccione insumo</option>
                                    @for(i of insumos(); track i.id){
                                        <option [value]="i.id">{{i.nombre}} (Stock: {{i.cantidad}})</option>
                                    }
                                </select>
                            </div>
                            <div class="mb-3">
                                <label>Cantidad:</label>
                                <input [(ngModel)]="cantidadDispensar" type="number" min="1" class="form-control" />
                            </div>
                            <div class="mb-3">
                                <label>Fecha:</label>
                                <input [(ngModel)]="fechaDispensacion" type="date" class="form-control" />
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button (click)="cerrarDispensacion()" class="btn btn-secondary">Cancelar</button>
                            <button (click)="registrarDispensacion()" [disabled]="!insumoSeleccionado || !cantidadDispensar" class="btn btn-primary">Registrar</button>
                        </div>
                    </div>
                </div>
            </div>
        }
    `
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

    ngOnInit() {
        this.cargar()
    }

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
                        userId: res.user.id,
                        nombre: res.user.nombre,
                        apellidoPaterno: res.user.apellidoPaterno,
                        ci: res.user.ci,
                        edad: this.calcularEdad(res.user.fechaNacimiento),
                        motivo: res.motivo,
                        imagen: res.imagen ? `http://localhost:3000/uploads/${res.imagen}` : null
                    })
                    // Cargar alergias después de atender
                    this.svc.getAlergias(res.user.id).subscribe(al => this.alergias.set(al))
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
        this.alergias.set([])
    }

    abrirDispensacion() {
        this.insumoSeleccionado = 0
        this.cantidadDispensar = 0
        this.fechaDispensacion = new Date().toISOString().split('T')[0]
        this.mostrarDispensacion.set(true)
    }

    cerrarDispensacion() {
        this.mostrarDispensacion.set(false)
    }

    registrarDispensacion() {
        const paciente = this.paciente()
        if (!paciente || !paciente.userId) return
        this.svc.dispensar(paciente.userId, this.insumoSeleccionado, this.cantidadDispensar, this.fechaDispensacion)
            .subscribe({
                next: () => {
                    alert('Dispensación registrada')
                    this.cerrarDispensacion()
                    this.cargar()
                },
                error: (err) => alert(err.error?.message || 'Error al dispensar')
            })
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
}