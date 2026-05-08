import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environment'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-fila-publica',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div style="padding: 20px; font-family: Arial, sans-serif; background: #f0f0f0; min-height: 100vh;">
            <h2 style="text-align: center; color: #333;">Fila Virtual</h2>
            
            <!-- Tarjetas para cada especialidad médica -->
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px;">
                @for(esp of datos()?.especialidades; track esp.especialidad){
                    <div style="background: white; border-radius: 10px; padding: 20px; width: 250px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                        <h3 style="color: #007bff; margin-top: 0;">{{ esp.especialidad }}</h3>
                        <p style="font-size: 16px; margin: 10px 0;">
                            <strong>Paciente:</strong> {{ esp.paciente }}
                        </p>
                        <p>Sala: {{ esp.sala }}</p>
                    </div>
                }
                @empty {
                    <p>No hay pacientes siendo atendidos en este momento.</p>
                }
            </div>

            <!-- Tarjeta de Enfermería -->
            <div style="margin-top: 30px; display: flex; justify-content: center;">
                <div style="background: white; border-radius: 10px; padding: 20px; width: 300px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                    <h3 style="color: #28a745; margin-top: 0;">Enfermería</h3>
                    @if (datos()?.enfermeria) {
                        <p style="font-size: 16px; margin: 10px 0;">
                            <strong>Paciente:</strong> {{ datos()?.enfermeria?.paciente }}
                        </p>
                        <p>Sala: {{ datos()?.enfermeria?.sala }}</p>
                    } @else {
                        <p>No hay paciente siendo atendido.</p>
                    }
                    <p>Pacientes en espera: {{ datos()?.esperaEnfermeria }}</p>
                </div>
            </div>

            <p style="text-align: center; color: #888; margin-top: 20px;">Actualización automática cada 3 segundos</p>
        </div>
    `
})
export class FilaPublicaComponent implements OnInit, OnDestroy {
    datos = signal<any>(null)
    private intervalId: any
    private http = inject(HttpClient)

    ngOnInit() {
        this.cargar()
        this.intervalId = setInterval(() => this.cargar(), 3000)
    }

    ngOnDestroy() {
        clearInterval(this.intervalId)
    }

    cargar() {
        this.http.get(`${environment.apiUrl}/fila-publica`).subscribe({
            next: (res) => this.datos.set(res),
            error: () => console.log('Error al cargar fila pública')
        })
    }
}