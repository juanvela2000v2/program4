import { Component, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { MedicoService } from '../../../core/services/medico.service'

@Component({
    selector: 'app-medico-receta',
    standalone: true,
    imports: [FormsModule],
    template: `
        <h2>Crear Receta Médica</h2>
        <div><label>ID Paciente:</label><input [(ngModel)]="userId" type="number" /></div>
        <div><label>Medicamento:</label><input [(ngModel)]="receta.medicamento" /></div>
        <div><label>Dosis:</label><input [(ngModel)]="receta.dosis" /></div>
        <div><label>Frecuencia:</label><input [(ngModel)]="receta.frecuencia" /></div>
        <div><label>Duración:</label><input [(ngModel)]="receta.duracion" /></div>
        <div><label>Instrucciones:</label><textarea [(ngModel)]="receta.instrucciones" rows="2"></textarea></div>
        <button (click)="guardar()">Guardar Receta</button>
        <button (click)="imprimir()" [disabled]="!recetaCreada()">Imprimir Receta</button>
        @if (recetaCreada()) {
            <div id="receta-impresa" style="display:none">
                <h3>RECETA MÉDICA</h3>
                <p>Paciente: {{ pacienteNombre }}</p>
                <p>Fecha: {{ receta.fecha }}</p>
                <p>Médico: Dr. {{ medicoNombre }}</p>
                <hr/>
                <p>Medicamento: {{ receta.medicamento }}</p>
                <p>Dosis: {{ receta.dosis }}</p>
                <p>Frecuencia: {{ receta.frecuencia }}</p>
                <p>Duración: {{ receta.duracion }}</p>
                <p>Instrucciones: {{ receta.instrucciones }}</p>
            </div>
        }
    `
})
export class MedicoRecetaComponent {
    userId: number = 0
    receta = {
        medicamento: '',
        dosis: '',
        frecuencia: '',
        duracion: '',
        instrucciones: '',
        fecha: new Date().toISOString().split('T')[0]
    }
    recetaCreada = signal(false)
    pacienteNombre = ''
    medicoNombre = ''   // opcional
    private svc = inject(MedicoService)
    private route = inject(ActivatedRoute)

    constructor() {
        this.route.queryParams.subscribe(params => {
            if (params['userId']) this.userId = +params['userId']
            if (params['ci']) this.pacienteNombre = params['ci']
        })
    }

    guardar() {
        if (!this.userId) return alert('Ingrese ID')
        this.svc.crearReceta({ ...this.receta, userId: this.userId }).subscribe(() => {
            this.recetaCreada.set(true)
        })
    }

    imprimir() {
        const contenido = document.getElementById('receta-impresa')?.innerHTML
        const ventana = window.open('', '', 'width=600,height=400')
        if (ventana && contenido) {
            ventana.document.write('<html><head><title>Receta</title></head><body>')
            ventana.document.write(contenido)
            ventana.document.write('</body></html>')
            ventana.document.close()
            ventana.print()
        }
    }
}