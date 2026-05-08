import { Component, inject, signal, OnInit } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { EnfermeraService } from "../../../core/services/enfermera.service"

@Component({
    selector: 'app-enfermera-almacen',
    template: `
        <h2>Almacén de Inyectables</h2>
        <div>
            <input [(ngModel)]="nuevo.nombre" placeholder="Nombre" />
            <input [(ngModel)]="nuevo.cantidad" type="number" placeholder="Cantidad" />
            <input [(ngModel)]="nuevo.descripcion" placeholder="Descripción" />
            <button (click)="crear()">Agregar</button>
        </div>
        <table border="1">
            <tr><th>Nombre</th><th>Cantidad</th><th>Descripción</th><th>Acciones</th></tr>
            @for(i of insumos(); track i.id){
                <tr>
                    <td>{{i.nombre}}</td>
                    <td>{{i.cantidad}}</td>
                    <td>{{i.descripcion}}</td>
                    <td>
                        <button (click)="editar(i)">Editar</button>
                        <button (click)="eliminar(i.id)">Eliminar</button>
                    </td>
                </tr>
            }
        </table>

        @if(editando()){
            <div>
                <h3>Editar Insumo</h3>
                <input [(ngModel)]="editData.nombre" placeholder="Nombre"/>
                <input [(ngModel)]="editData.cantidad" type="number" placeholder="Cantidad"/>
                <input [(ngModel)]="editData.descripcion" placeholder="Descripción"/>
                <button (click)="guardarEdicion()">Guardar</button>
                <button (click)="cancelarEdicion()">Cancelar</button>
            </div>
        }
    `,
    standalone: true,
    imports: [FormsModule]
})
export class EnfermeraAlmacenComponent implements OnInit {
    insumos = signal<any[]>([])
    nuevo = { nombre: '', cantidad: 0, descripcion: '' }
    editando = signal(false)
    editData = { id: 0, nombre: '', cantidad: 0, descripcion: '' }

    private svc = inject(EnfermeraService)

    ngOnInit() {
        this.cargar()
    }

    cargar() {
        this.svc.getInsumos().subscribe(res => this.insumos.set(res))
    }

    crear() {
        this.svc.createInsumo(this.nuevo).subscribe(() => {
            this.nuevo = { nombre: '', cantidad: 0, descripcion: '' }
            this.cargar()
        })
    }

    editar(insumo: any) {
        this.editData = { ...insumo }
        this.editando.set(true)
    }

    guardarEdicion() {
        this.svc.updateInsumo(this.editData.id, {
            nombre: this.editData.nombre,
            cantidad: this.editData.cantidad,
            descripcion: this.editData.descripcion
        }).subscribe(() => {
            this.editando.set(false)
            this.cargar()
        })
    }

    cancelarEdicion() {
        this.editando.set(false)
    }

    eliminar(id: number) {
        if (confirm('¿Eliminar?')) {
            this.svc.deleteInsumo(id).subscribe(() => this.cargar())
        }
    }
}