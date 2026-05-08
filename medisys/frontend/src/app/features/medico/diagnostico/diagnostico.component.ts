import { Component, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { MedicoService } from '../../../core/services/medico.service'

@Component({
    selector: 'app-medico-diagnostico',
    standalone: true,
    imports: [FormsModule],
    template: `
        <h2>Registrar Diagnóstico</h2>
        <div>
            <label>ID Paciente:</label>
            <input [(ngModel)]="userId" type="number" />
        </div>
        <div><label>Motivo de consulta:</label><textarea [(ngModel)]="diagnostico.motivoConsulta" rows="2"></textarea></div>
        <div><label>Síntomas:</label><textarea [(ngModel)]="diagnostico.sintomas" rows="3"></textarea></div>
        <div><label>Evaluación clínica:</label><textarea [(ngModel)]="diagnostico.evaluacionClinica" rows="3"></textarea></div>
        <div><label>Diagnóstico:</label><input [(ngModel)]="diagnostico.diagnostico" /></div>
        <div><label>CIE10:</label><input [(ngModel)]="diagnostico.cie10" /></div>
        <div><label>Observaciones:</label><textarea [(ngModel)]="diagnostico.observaciones" rows="2"></textarea></div>
        <button (click)="guardar()">Guardar Diagnóstico</button>
        @if (success()) { <p style="color:green">Registrado</p> }
    `
})
export class MedicoDiagnosticoComponent {
    userId: number = 0
    diagnostico = {
        motivoConsulta: '',
        sintomas: '',
        evaluacionClinica: '',
        diagnostico: '',
        cie10: '',
        observaciones: ''
    }
    success = signal(false)
    private svc = inject(MedicoService)
    private route = inject(ActivatedRoute)

    constructor() {
        this.route.queryParams.subscribe(params => {
            if (params['userId']) this.userId = +params['userId']
        })
    }

    guardar() {
        if (!this.userId) return alert('Ingrese ID del paciente')
        this.svc.crearDiagnostico(this.userId, this.diagnostico).subscribe(() => {
            this.success.set(true)
            this.diagnostico = { motivoConsulta: '', sintomas: '', evaluacionClinica: '', diagnostico: '', cie10: '', observaciones: '' }
        })
    }
}