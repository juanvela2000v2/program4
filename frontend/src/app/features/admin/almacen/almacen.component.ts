import { Component, inject, signal, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from './../../../environment'
import { FormsModule } from '@angular/forms'

@Component({
    selector: 'app-admin-almacen',
    standalone: true,
    imports: [FormsModule],
    template: `
        <div class="page-container">
            <div class="page-header">
                <h2>Almacén</h2>
                <button class="btn-primary" (click)="nuevoInsumo()"><i class="bi bi-plus-lg"></i> Nuevo Insumo</button>
            </div>

            @if (mostrarForm()) {
                <div class="modal-overlay">
                    <div class="modal-card" style="max-width:450px">
                        <div class="modal-header">
                            <h3>{{ editando() ? 'Editar' : 'Nuevo' }} Insumo</h3>
                            <button class="btn-close" (click)="cancelar()">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="input-group"><label>Nombre</label><input [(ngModel)]="form.nombre" class="form-control" placeholder="Nombre del insumo" /></div>
                            <div class="input-group"><label>Cantidad</label><input [(ngModel)]="form.cantidad" type="number" class="form-control" placeholder="0" /></div>
                            <div class="input-group"><label>Descripción</label><textarea [(ngModel)]="form.descripcion" class="form-control" rows="3" placeholder="Descripción opcional"></textarea></div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn-secondary" (click)="cancelar()">Cancelar</button>
                            <button class="btn-primary" (click)="guardar()">{{ editando() ? 'Actualizar' : 'Guardar' }}</button>
                        </div>
                    </div>
                </div>
            }

            <div class="table-card">
                <table>
                    <thead>
                        <tr><th>Nombre</th><th>Cantidad</th><th>Descripción</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                        @for (i of insumos(); track i.id) {
                            <tr>
                                <td><strong>{{ i.nombre }}</strong></td>
                                <td>
                                    <span class="badge" [class.badge-low]="i.cantidad < 10" [class.badge-ok]="i.cantidad >= 10">
                                        {{ i.cantidad }}
                                    </span>
                                </td>
                                <td>{{ i.descripcion || '-' }}</td>
                                <td>
                                    <button class="btn-icon edit" (click)="editarInsumo(i)"><i class="bi bi-pencil"></i></button>
                                    <button class="btn-icon delete" (click)="eliminar(i.id)"><i class="bi bi-trash"></i></button>
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    `,
    styles: [`
        .page-container { padding: 2rem; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .page-header h2 { font-size: 1.5rem; font-weight: 700; color: #1e293b; }
        .btn-primary { padding: 0.6rem 1.2rem; background: #2563eb; color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: background 0.2s; }
        .btn-primary:hover { background: #1d4ed8; }
        .btn-secondary { padding: 0.6rem 1.2rem; background: #e2e8f0; color: #475569; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
        .btn-icon { border: none; padding: 0.4rem 0.6rem; border-radius: 0.3rem; cursor: pointer; margin-right: 0.3rem; font-size: 0.9rem; }
        .btn-icon.edit { background: #fef3c7; color: #b45309; }
        .btn-icon.delete { background: #fee2e2; color: #dc2626; }
        .table-card { background: white; border-radius: 1rem; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 1rem; font-size: 0.85rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; background: #f8fafc; }
        td { padding: 1rem; color: #334155; border-top: 1px solid #f1f5f9; }
        .badge { padding: 0.2rem 0.6rem; border-radius: 1rem; font-size: 0.85rem; font-weight: 600; }
        .badge-low { background: #fee2e2; color: #dc2626; }
        .badge-ok { background: #d1fae5; color: #059669; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-card { background: white; border-radius: 1rem; width: 90%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid #e2e8f0; }
        .modal-header h3 { font-size: 1.3rem; font-weight: 600; color: #1e293b; }
        .btn-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #94a3b8; }
        .modal-body { padding: 1.5rem; }
        .input-group { margin-bottom: 1rem; }
        .input-group label { display: block; font-weight: 600; margin-bottom: 0.3rem; color: #334155; font-size: 0.9rem; }
        .form-control { width: 100%; padding: 0.65rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; font-size: 0.95rem; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
        .form-control:focus { border-color: #2563eb; }
        .modal-footer { padding: 1.5rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; gap: 0.7rem; }
    `]
})
export class AdminAlmacenComponent implements OnInit {
    insumos = signal<any[]>([])
    mostrarForm = signal(false)
    editando = signal(false)
    editId: number | null = null
    form = { nombre: '', cantidad: 0, descripcion: '' }

    private http = inject(HttpClient)

    ngOnInit() { this.cargar() }

    cargar() { this.http.get<any[]>(`${environment.apiUrl}/admin/almacen`, { withCredentials: true }).subscribe(res => this.insumos.set(res)) }

    nuevoInsumo() { this.form = { nombre: '', cantidad: 0, descripcion: '' }; this.editando.set(false); this.editId = null; this.mostrarForm.set(true) }

    editarInsumo(insumo: any) { this.form = { nombre: insumo.nombre, cantidad: insumo.cantidad, descripcion: insumo.descripcion || '' }; this.editando.set(true); this.editId = insumo.id; this.mostrarForm.set(true) }

    guardar() {
        if (this.editando() && this.editId) {
            this.http.put(`${environment.apiUrl}/admin/almacen/${this.editId}`, this.form, { withCredentials: true }).subscribe(() => { this.cargar(); this.cancelar() })
        } else {
            this.http.post(`${environment.apiUrl}/admin/almacen`, this.form, { withCredentials: true }).subscribe(() => { this.cargar(); this.cancelar() })
        }
    }

    cancelar() { this.mostrarForm.set(false) }

    eliminar(id: number) { if (confirm('¿Eliminar insumo?')) { this.http.delete(`${environment.apiUrl}/admin/almacen/${id}`, { withCredentials: true }).subscribe(() => this.cargar()) } }
}