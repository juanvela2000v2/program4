import { Component, inject, signal, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from './../../../environment'
import { FormsModule } from '@angular/forms'

@Component({
    selector: 'app-admin-medicos',
    standalone: true,
    imports: [FormsModule],
    template: `
        <div class="page-container">
            <div class="page-header">
                <h2>Gestión de Médicos</h2>
                <button class="btn-primary" (click)="nuevoMedico()"><i class="bi bi-plus-lg"></i> Nuevo Médico</button>
            </div>

            @if (mostrarForm()) {
                <div class="modal-overlay">
                    <div class="modal-card">
                        <div class="modal-header">
                            <h3>{{ editando() ? 'Editar' : 'Nuevo' }} Médico</h3>
                            <button class="btn-close" (click)="cancelar()">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="form-grid">
                                <div class="input-group"><label>Nombre</label><input [(ngModel)]="form.nombre" class="form-control" /></div>
                                <div class="input-group"><label>Apellido Paterno</label><input [(ngModel)]="form.apellidoPaterno" class="form-control" /></div>
                                <div class="input-group"><label>Apellido Materno</label><input [(ngModel)]="form.apellidoMaterno" class="form-control" /></div>
                                <div class="input-group"><label>CI</label><input [(ngModel)]="form.ci" class="form-control" /></div>
                                <div class="input-group"><label>Fecha Nac.</label><input [(ngModel)]="form.fechaNacimiento" type="date" class="form-control" /></div>
                                <div class="input-group"><label>Sexo</label><input [(ngModel)]="form.sexo" class="form-control" /></div>
                                <div class="input-group"><label>Dirección</label><input [(ngModel)]="form.direccion" class="form-control" /></div>
                                <div class="input-group"><label>Teléfono</label><input [(ngModel)]="form.telefono" class="form-control" /></div>
                                <div class="input-group">
                                    <label>Especialidad</label>
                                    <select [(ngModel)]="form.especialidadId" class="form-control">
                                        <option value="0">Seleccione especialidad</option>
                                        @for (esp of especialidades(); track esp.id) {
                                            <option [value]="esp.id">{{ esp.nombre }}</option>
                                        }
                                    </select>
                                </div>
                                <div class="input-group"><label>Usuario</label><input [(ngModel)]="form.login" class="form-control" /></div>
                                <div class="input-group"><label>Contraseña</label><input [(ngModel)]="form.pass" type="password" class="form-control" /></div>
                            </div>
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
                    <thead><tr><th>Nombre</th><th>CI</th><th>Especialidad</th><th>Usuario</th><th>Acciones</th></tr></thead>
                    <tbody>
                        @for (m of medicos(); track m.id) {
                            <tr>
                                <td>{{ m.nombre }} {{ m.apellidoPaterno }}</td>
                                <td>{{ m.ci }}</td>
                                <td>{{ m.especialidad?.nombre || 'Sin especialidad' }}</td>
                                <td>{{ m.login }}</td>
                                <td>
                                    <button class="btn-icon edit" (click)="editarMedico(m)"><i class="bi bi-pencil"></i></button>
                                    <button class="btn-icon delete" (click)="eliminar(m.id)"><i class="bi bi-trash"></i></button>
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
        .btn-primary { padding: 0.6rem 1.2rem; background: #2563eb; color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
        .btn-secondary { padding: 0.6rem 1.2rem; background: #e2e8f0; color: #475569; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
        .btn-icon { border: none; padding: 0.4rem 0.6rem; border-radius: 0.3rem; cursor: pointer; margin-right: 0.3rem; }
        .btn-icon.edit { background: #fef3c7; color: #b45309; }
        .btn-icon.delete { background: #fee2e2; color: #dc2626; }
        .table-card { background: white; border-radius: 1rem; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 1rem; font-size: 0.85rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; background: #f8fafc; }
        td { padding: 1rem; color: #334155; border-top: 1px solid #f1f5f9; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-card { background: white; border-radius: 1rem; width: 90%; max-width: 700px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid #e2e8f0; }
        .modal-header h3 { font-size: 1.3rem; font-weight: 600; color: #1e293b; }
        .btn-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #94a3b8; }
        .modal-body { padding: 1.5rem; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .input-group label { display: block; font-weight: 600; margin-bottom: 0.2rem; color: #334155; font-size: 0.9rem; }
        .form-control { width: 100%; padding: 0.6rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; font-size: 0.95rem; outline: none; box-sizing: border-box; }
        .form-control:focus { border-color: #2563eb; }
        .modal-footer { padding: 1.5rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; gap: 0.7rem; }
    `]
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
        especialidadId: 0, login: '', pass: '', rol: 'medico'
    }

    private http = inject(HttpClient)

    ngOnInit() {
        this.cargar()
        this.http.get<any[]>(`${environment.apiUrl}/especialidad`).subscribe(res => this.especialidades.set(res))
    }

    cargar() {
        this.http.get<any[]>(`${environment.apiUrl}/admin/users/medicos`, { withCredentials: true }).subscribe(res => this.medicos.set(res))
    }

    nuevoMedico() { this.limpiarFormulario(); this.editando.set(false); this.editId = null; this.mostrarForm.set(true) }

    editarMedico(medico: any) {
        this.form = {
            nombre: medico.nombre, apellidoPaterno: medico.apellidoPaterno, apellidoMaterno: medico.apellidoMaterno,
            ci: medico.ci, fechaNacimiento: medico.fechaNacimiento, sexo: medico.sexo,
            direccion: medico.direccion, telefono: medico.telefono, especialidadId: medico.especialidadId || 0,
            login: medico.login, pass: '', rol: 'medico'
        }
        this.editando.set(true); this.editId = medico.id; this.mostrarForm.set(true)
    }

    guardar() {
        const payload: any = { ...this.form }
        if (payload.especialidadId === 0) payload.especialidadId = null
        if (this.editando() && this.editId) {
            if (!payload.pass) delete payload.pass
            this.http.put(`${environment.apiUrl}/admin/users/${this.editId}`, payload, { withCredentials: true }).subscribe(() => { this.cargar(); this.cancelar() })
        } else {
            this.http.post(`${environment.apiUrl}/admin/users`, payload, { withCredentials: true }).subscribe(() => { this.cargar(); this.cancelar() })
        }
    }

    cancelar() { this.mostrarForm.set(false); this.limpiarFormulario() }

    limpiarFormulario() {
        this.form = { nombre: '', apellidoPaterno: '', apellidoMaterno: '', ci: '', fechaNacimiento: '', sexo: '', direccion: '', telefono: '', especialidadId: 0, login: '', pass: '', rol: 'medico' }
    }

    eliminar(id: number) {
        if (confirm('¿Eliminar médico?')) { this.http.delete(`${environment.apiUrl}/admin/users/${id}`, { withCredentials: true }).subscribe(() => this.cargar()) }
    }
}