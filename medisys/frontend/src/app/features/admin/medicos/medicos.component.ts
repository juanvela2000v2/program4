import { Component, inject, signal, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from './../../../environment'
import { FormsModule } from '@angular/forms'

@Component({
    selector: 'app-admin-medicos',
    standalone: true,
    imports: [FormsModule],
    template: `
        <h2>Gestión de Médicos</h2>
        <button (click)="nuevoMedico()">Nuevo Médico</button>

        @if(mostrarForm()){
            <div style="display: grid; gap: 10px; margin: 15px 0;">
                <input [(ngModel)]="form.nombre" placeholder="Nombre" />
                <input [(ngModel)]="form.apellidoPaterno" placeholder="Apellido Paterno" />
                <input [(ngModel)]="form.apellidoMaterno" placeholder="Apellido Materno" />
                <input [(ngModel)]="form.ci" placeholder="CI" />
                <input [(ngModel)]="form.fechaNacimiento" type="date" />
                <input [(ngModel)]="form.sexo" placeholder="Sexo (M/F)" />
                <input [(ngModel)]="form.direccion" placeholder="Dirección" />
                <input [(ngModel)]="form.telefono" placeholder="Teléfono" />

                <select [(ngModel)]="form.especialidadId">
                    <option value="0">Seleccione especialidad</option>
                    @for(esp of especialidades(); track esp.id){
                        <option [value]="esp.id">{{esp.nombre}}</option>
                    }
                </select>

                <input [(ngModel)]="form.login" placeholder="Usuario" />
                <input [(ngModel)]="form.pass" type="password" placeholder="Contraseña (nueva)" />
                <div>
                    <button (click)="guardar()">{{ editando() ? 'Actualizar' : 'Guardar' }}</button>
                    <button (click)="cancelar()" style="margin-left: 5px;">Cancelar</button>
                </div>
            </div>
        }

        <table border="1" style="margin-top: 10px;">
            <thead><tr><th>Nombre</th><th>CI</th><th>Especialidad</th><th>Usuario</th><th>Acciones</th></tr></thead>
            <tbody>
                @for(m of medicos(); track m.id){
                    <tr>
                        <td>{{m.nombre}} {{m.apellidoPaterno}}</td>
                        <td>{{m.ci}}</td>
                        <td>{{m.especialidad?.nombre || 'Sin especialidad'}}</td>
                        <td>{{m.login}}</td>
                        <td>
                            <button (click)="editarMedico(m)">Editar</button>
                            <button (click)="eliminar(m.id)">Eliminar</button>
                        </td>
                    </tr>
                }
            </tbody>
        </table>
    `
})
export class AdminMedicosComponent implements OnInit {
    medicos = signal<any[]>([])
    especialidades = signal<any[]>([])
    mostrarForm = signal(false)
    editando = signal(false)
    editId: number | null = null

    form = {
        nombre: '', apellidoPaterno: '', apellidoMaterno: '', ci: '',
        fechaNacimiento: '', sexo: '', direccion: '', telefono: '',
        especialidadId: 0,
        login: '', pass: '', rol: 'medico'
    }

    private http = inject(HttpClient)

    ngOnInit() {
        this.cargar()
        this.http.get<any[]>(`${environment.apiUrl}/especialidad`).subscribe(res => this.especialidades.set(res))
    }

    cargar() {
        this.http.get<any[]>(`${environment.apiUrl}/admin/users/medicos`, { withCredentials: true })
            .subscribe(res => this.medicos.set(res))
    }

    nuevoMedico() {
        this.limpiarFormulario()
        this.editando.set(false)
        this.editId = null
        this.mostrarForm.set(true)
    }

    editarMedico(medico: any) {
        this.form = {
            nombre: medico.nombre,
            apellidoPaterno: medico.apellidoPaterno,
            apellidoMaterno: medico.apellidoMaterno,
            ci: medico.ci,
            fechaNacimiento: medico.fechaNacimiento,
            sexo: medico.sexo,
            direccion: medico.direccion,
            telefono: medico.telefono,
            especialidadId: medico.especialidadId || 0,
            login: medico.login,
            pass: '',   // contraseña vacía para no cambiarla si no se escribe
            rol: 'medico'
        }
        this.editando.set(true)
        this.editId = medico.id
        this.mostrarForm.set(true)
    }

    guardar() {
        const payload = { ...this.form }
        if (this.editando() && this.editId) {
            // Si no se escribió nueva contraseña, no enviar pass
            if (!payload.pass) delete (payload as any).pass
            this.http.put(`${environment.apiUrl}/admin/users/${this.editId}`, payload, { withCredentials: true })
                .subscribe(() => {
                    this.cargar()
                    this.cancelar()
                }, error => alert('Error al actualizar'))
        } else {
            this.http.post(`${environment.apiUrl}/admin/users`, payload, { withCredentials: true })
                .subscribe(() => {
                    this.cargar()
                    this.cancelar()
                }, error => alert('Error al crear'))
        }
    }

    cancelar() {
        this.mostrarForm.set(false)
        this.limpiarFormulario()
    }

    limpiarFormulario() {
        this.form = {
            nombre: '', apellidoPaterno: '', apellidoMaterno: '', ci: '',
            fechaNacimiento: '', sexo: '', direccion: '', telefono: '',
            especialidadId: 0,
            login: '', pass: '', rol: 'medico'
        }
    }

    eliminar(id: number) {
        if (confirm('¿Eliminar médico?')) {
            this.http.delete(`${environment.apiUrl}/admin/users/${id}`, { withCredentials: true })
                .subscribe(() => this.cargar())
        }
    }
}