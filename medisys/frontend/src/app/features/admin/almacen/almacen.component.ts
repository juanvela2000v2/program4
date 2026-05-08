import { Component, inject, signal, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from './../../../environment'
import { FormsModule } from '@angular/forms'

@Component({
    selector: 'app-admin-almacen',
    standalone: true,
    imports: [FormsModule],
    template: `
        <h2>Almacén</h2>
        <button (click)="nuevoInsumo()">Nuevo Insumo</button>

        @if(mostrarForm()){
            <div style="display: grid; gap: 10px; margin: 15px 0;">
                <input [(ngModel)]="form.nombre" placeholder="Nombre" />
                <input [(ngModel)]="form.cantidad" type="number" placeholder="Cantidad" />
                <input [(ngModel)]="form.descripcion" placeholder="Descripción" />
                <div>
                    <button (click)="guardar()">{{ editando() ? 'Actualizar' : 'Guardar' }}</button>
                    <button (click)="cancelar()" style="margin-left: 5px;">Cancelar</button>
                </div>
            </div>
        }

        <table border="1" style="margin-top: 10px;">
            <thead><tr><th>Nombre</th><th>Cantidad</th><th>Descripción</th><th>Acciones</th></tr></thead>
            <tbody>
                @for(i of insumos(); track i.id){
                    <tr>
                        <td>{{i.nombre}}</td>
                        <td>{{i.cantidad}}</td>
                        <td>{{i.descripcion}}</td>
                        <td>
                            <button (click)="editarInsumo(i)">Editar</button>
                            <button (click)="eliminar(i.id)">Eliminar</button>
                        </td>
                    </tr>
                }
            </tbody>
        </table>
    `
})
export class AdminAlmacenComponent implements OnInit {
    insumos = signal<any[]>([])
    mostrarForm = signal(false)
    editando = signal(false)
    editId: number | null = null

    form = { nombre: '', cantidad: 0, descripcion: '' }

    private http = inject(HttpClient)

    ngOnInit() {
        this.cargar()
    }

    cargar() {
        this.http.get<any[]>(`${environment.apiUrl}/admin/almacen`, { withCredentials: true })
            .subscribe(res => this.insumos.set(res))
    }

    nuevoInsumo() {
        this.form = { nombre: '', cantidad: 0, descripcion: '' }
        this.editando.set(false)
        this.editId = null
        this.mostrarForm.set(true)
    }

    editarInsumo(insumo: any) {
        this.form = {
            nombre: insumo.nombre,
            cantidad: insumo.cantidad,
            descripcion: insumo.descripcion
        }
        this.editando.set(true)
        this.editId = insumo.id
        this.mostrarForm.set(true)
    }

    guardar() {
        if (this.editando() && this.editId) {
            this.http.put(`${environment.apiUrl}/admin/almacen/${this.editId}`, this.form, { withCredentials: true })
                .subscribe(() => { this.cargar(); this.cancelar() }, error => alert('Error al actualizar'))
        } else {
            this.http.post(`${environment.apiUrl}/admin/almacen`, this.form, { withCredentials: true })
                .subscribe(() => { this.cargar(); this.cancelar() }, error => alert('Error al crear'))
        }
    }

    cancelar() {
        this.mostrarForm.set(false)
    }

    eliminar(id: number) {
        if (confirm('¿Eliminar insumo?')) {
            this.http.delete(`${environment.apiUrl}/admin/almacen/${id}`, { withCredentials: true })
                .subscribe(() => this.cargar())
        }
    }
}