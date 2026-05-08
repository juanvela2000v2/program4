import { Component, inject, signal, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { MedicoService } from '../../../core/services/medico.service'

@Component({
    selector: 'app-medico-historial',
    standalone: true,
    imports: [FormsModule],
    template: `
        <h2>Historial Clínico</h2>
        <div>
            <label>CI del paciente:</label>
            <input [(ngModel)]="ci" />
            <button (click)="buscar()">Buscar</button>
        </div>
        @if (historial()) {
            <h3>Paciente: {{ historial().paciente.nombre }} {{ historial().paciente.apellidoPaterno }}</h3>
            @if (historial().alergias?.length) {
    <div style="border: 2px solid red; padding: 10px; margin-bottom: 15px; background: #fff5f5;">
        <h4 style="color: red;">Historial de Alergias</h4>
        <ul>
            @for(a of historial().alergias; track a.id){
                <li>
                    <strong>{{ a.agente }}</strong> - {{ a.tipoReaccion }} ({{ a.severidad }}) 
                    - Estatus: {{ a.estatus }} - Fuente: {{ a.fuente }}
                </li>
            }
        </ul>
    </div>
}
            <h4>Diagnósticos</h4>
            @for(d of historial().diagnosticos; track d.id){
                <div style="border: 1px solid #ccc; margin: 10px 0; padding: 10px;">
                    <p><strong>DIAGNÓSTICO MÉDICO</strong></p>
                    <p>Paciente: {{ historial().paciente.nombre }} {{ historial().paciente.apellidoPaterno }}</p>
                    <p>Fecha: {{ d.fecha }}</p>
                    <p>Médico: Dr. {{ d.medico?.nombre }} {{ d.medico?.apellidoPaterno }}</p>
                    <hr/>
                    <p><strong>MOTIVO DE CONSULTA</strong><br/>{{ d.motivoConsulta }}</p>
                    <p><strong>SÍNTOMAS</strong><br/>{{ d.sintomas }}</p>
                    <p><strong>EVALUACIÓN CLÍNICA</strong><br/>{{ d.evaluacionClinica }}</p>
                    <p><strong>DIAGNÓSTICO</strong><br/>{{ d.diagnostico }} (CIE10: {{ d.cie10 }})</p>
                    <p><strong>OBSERVACIONES</strong><br/>{{ d.observaciones }}</p>
                </div>
            }
            <h4>Recetas</h4>
            @for(r of historial().recetas; track r.id){
                <div style="border: 1px solid #999; margin: 10px 0; padding: 10px;">
                    <p><strong>RECETA MÉDICA</strong></p>
                    <p>Fecha: {{ r.fecha }}</p>
                    <p>Médico: Dr. {{ r.medico?.nombre }} {{ r.medico?.apellidoPaterno }}</p>
                    <p>Medicamento: {{ r.medicamento }}</p>
                    <p>Dosis: {{ r.dosis }}</p>
                    <p>Frecuencia: {{ r.frecuencia }}</p>
                    <p>Duración: {{ r.duracion }}</p>
                    <p>Instrucciones: {{ r.instrucciones }}</p>
                </div>
            }
        }
    `
})
export class MedicoHistorialComponent implements OnInit {
    ci = ''
    historial = signal<any>(null)
    private svc = inject(MedicoService)
    private route = inject(ActivatedRoute)

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['ci']) {
                this.ci = params['ci']
                this.buscar()
            }
        })
    }

    buscar() {
        if (!this.ci) return
        this.svc.getHistorial(this.ci).subscribe({
            next: (res) => this.historial.set(res),
            error: () => alert('Paciente no encontrado')
        })
    }
}