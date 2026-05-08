import { Component, inject, signal, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from './../../../environment'
import { FormsModule } from '@angular/forms'

@Component({
    selector: 'app-admin-enfermeras',
    standalone: true,
    imports: [FormsModule],
    template: `
        <h2>Gestión de Enfermeras</h2>
        <button (click)="nuevoEnfermera()">Nueva Enfermera</button>

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
                <input [(ngModel)]="form.login" placeholder="Usuario" />
                <input [(ngModel)]="form.pass" type="password" placeholder="Contraseña (nueva)" />
                <div>
                    <button (click)="guardar()">{{ editando() ? 'Actualizar' : 'Guardar' }}</button>
                    <button (click)="cancelar()" style="margin-left: 5px;">Cancelar</button>
                </div>
            </div>
        }

        <table border="1" style="margin-top: 10px;">
            <thead><tr><th>Nombre</th><th>CI</th><th>Usuario</th><th>Acciones</th></tr></thead>
            <tbody>
                @for(e of enfermeras(); track e.id){
                    <tr>
                        <td>{{e.nombre}} {{e.apellidoPaterno}}</td>
                        <td>{{e.ci}}</td>
                        <td>{{e.login}}</td>
                        <td>
                            <button (click)="editarEnfermera(e)">Editar</button>
                            <button (click)="eliminar(e.id)">Eliminar</button>
                        </td>
                    </tr>
                }
            </tbody>
        </table>
    `
})
export class AdminEnfermerasComponent implements OnInit {
    enfermeras = signal<any[]>([])
    mostrarForm = signal(false)
    editando = signal(false)
    editId: number | null = null

    form = {
        nombre: '', apellidoPaterno: '', apellidoMaterno: '', ci: '',
        fechaNacimiento: '', sexo: '', direccion: '', telefono: '',
        login: '', pass: '', rol: 'enfermera'
    }

    private http = inject(HttpClient)

    ngOnInit() {
        this.cargar()
    }

    cargar() {
        this.http.get<any[]>(`${environment.apiUrl}/admin/users/enfermeras`, { withCredentials: true })
            .subscribe(res => this.enfermeras.set(res))
    }

    nuevoEnfermera() {
        this.limpiarFormulario()
        this.editando.set(false)
        this.editId = null
        this.mostrarForm.set(true)
    }

    editarEnfermera(enfermera: any) {
        this.form = {
            nombre: enfermera.nombre,
            apellidoPaterno: enfermera.apellidoPaterno,
            apellidoMaterno: enfermera.apellidoMaterno,
            ci: enfermera.ci,
            fechaNacimiento: enfermera.fechaNacimiento,
            sexo: enfermera.sexo,
            direccion: enfermera.direccion,
            telefono: enfermera.telefono,
            login: enfermera.login,
            pass: '',
            rol: 'enfermera'
        }
        this.editando.set(true)
        this.editId = enfermera.id
        this.mostrarForm.set(true)
    }

    guardar() {
        const payload = { ...this.form }
        if (this.editando() && this.editId) {
            if (!payload.pass) delete (payload as any).pass
            this.http.put(`${environment.apiUrl}/admin/users/${this.editId}`, payload, { withCredentials: true })
                .subscribe(() => { this.cargar(); this.cancelar() }, error => alert('Error al actualizar'))
        } else {
            this.http.post(`${environment.apiUrl}/admin/users`, payload, { withCredentials: true })
                .subscribe(() => { this.cargar(); this.cancelar() }, error => alert('Error al crear'))
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
            login: '', pass: '', rol: 'enfermera'
        }
    }

    eliminar(id: number) {
        if (confirm('¿Eliminar enfermera?')) {
            this.http.delete(`${environment.apiUrl}/admin/users/${id}`, { withCredentials: true })
                .subscribe(() => this.cargar())
        }
    }
}