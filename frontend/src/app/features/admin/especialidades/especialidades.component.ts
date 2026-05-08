import { Component, inject, signal, OnInit } from '@angular/core'
import { AdminService } from './../../../core/services/admin.service'
import { FormsModule } from '@angular/forms'

@Component({
    selector: 'app-admin-especialidades',
    standalone: true,
    imports: [FormsModule],
    template: `
        <div class="page-container">
            <div class="page-header">
                <h2>Especialidades</h2>
                <button class="btn-primary" (click)="showForm.set(true)"><i class="bi bi-plus-lg"></i> Agregar</button>
            </div>

            @if (showForm()) {
                <div class="modal-overlay">
                    <div class="modal-card">
                        <div class="modal-header">
                            <h3>Nueva Especialidad</h3>
                            <button class="btn-close" (click)="showForm.set(false)">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="input-group">
                                <label>Nombre de la especialidad</label>
                                <input [(ngModel)]="nombre" class="form-control" placeholder="Ej: Cardiología, Pediatría..." />
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn-secondary" (click)="showForm.set(false)">Cancelar</button>
                            <button class="btn-primary" (click)="agregar()">Guardar</button>
                        </div>
                    </div>
                </div>
            }

            <div class="table-card">
                <table>
                    <thead>
                        <tr><th>Nombre</th><th>Acción</th></tr>
                    </thead>
                    <tbody>
                        @for (e of especialidades(); track e.id) {
                            <tr>
                                <td><strong>{{ e.nombre }}</strong></td>
                                <td>
                                    <button class="btn-icon delete" (click)="eliminar(e.id)"><i class="bi bi-trash"></i></button>
                                </td>
                            </tr>
                        } @empty {
                            <tr>
                                <td colspan="2" class="text-center text-muted py-3">No hay especialidades registradas</td>
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
        .btn-icon { border: none; padding: 0.4rem 0.6rem; border-radius: 0.3rem; cursor: pointer; font-size: 0.9rem; }
        .btn-icon.delete { background: #fee2e2; color: #dc2626; }
        .text-center { text-align: center; }
        .text-muted { color: #94a3b8; }
        .table-card { background: white; border-radius: 1rem; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 1rem; font-size: 0.85rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; background: #f8fafc; }
        td { padding: 1rem; color: #334155; border-top: 1px solid #f1f5f9; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-card { background: white; border-radius: 1rem; width: 90%; max-width: 400px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid #e2e8f0; }
        .modal-header h3 { font-size: 1.3rem; font-weight: 600; color: #1e293b; }
        .btn-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #94a3b8; }
        .modal-body { padding: 1.5rem; }
        .input-group { margin-bottom: 0.5rem; }
        .input-group label { display: block; font-weight: 600; margin-bottom: 0.3rem; color: #334155; font-size: 0.9rem; }
        .form-control { width: 100%; padding: 0.65rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; font-size: 0.95rem; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
        .form-control:focus { border-color: #2563eb; }
        .modal-footer { padding: 1.5rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; gap: 0.7rem; }
    `]
})
export class AdminEspecialidadesComponent implements OnInit {
    especialidades = signal<any[]>([])
    showForm = signal(false)
    nombre = ''
    private svc = inject(AdminService)

    ngOnInit() { this.svc.getEspecialidades().subscribe(res => this.especialidades.set(res)) }

    agregar() {
        if (!this.nombre.trim()) return
        this.svc.createEspecialidad(this.nombre.trim()).subscribe(() => {
            this.nombre = ''
            this.showForm.set(false)
            this.ngOnInit()
        })
    }

    eliminar(id: number) {
        if (confirm('¿Eliminar esta especialidad?')) {
            this.svc.deleteEspecialidad(id).subscribe(() => this.ngOnInit())
        }
    }
}