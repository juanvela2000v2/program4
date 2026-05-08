import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: 'app-inicio-usuario',
  standalone: true,
  template: `
    <div class="inicio-container">
      <h2 class="inicio-title">Bienvenido al Hospital</h2>
      <p class="inicio-subtitle">Seleccione una opción para comenzar</p>

      <div class="cards-grid">
        <div class="card" (click)="irCitaMedica()">
          <div class="card-icon" style="background: #eff6ff;">
            <i class="bi bi-calendar-plus" style="color: #2563eb;"></i>
          </div>
          <h3>Reservar Cita Médica</h3>
          <p>Agende una consulta con un especialista</p>
        </div>

        <div class="card" (click)="irCitaEnfermeria()">
          <div class="card-icon" style="background: #f0fdf4;">
            <i class="bi bi-heart-pulse" style="color: #16a34a;"></i>
          </div>
          <h3>Cita de Enfermería</h3>
          <p>Solicite atención de enfermería</p>
        </div>

        <div class="card" (click)="irFilaVirtual()">
          <div class="card-icon" style="background: #fff7ed;">
            <i class="bi bi-people" style="color: #ea580c;"></i>
          </div>
          <h3>Fila Virtual</h3>
          <p>Consulte su posición en la fila</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .inicio-container { padding: 1rem 0; }
    .inicio-title { font-size: 1.8rem; font-weight: 700; color: #1e293b; margin-bottom: 0.3rem; }
    .inicio-subtitle { color: #64748b; margin-bottom: 2rem; }
    .cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; }
    .card {
      background: white; border-radius: 1rem; padding: 2rem 1.5rem; text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
    }
    .card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0,0,0,0.08); }
    .card-icon {
      width: 3.5rem; height: 3.5rem; border-radius: 50%; display: flex;
      align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 1.8rem;
    }
    .card h3 { font-size: 1.2rem; font-weight: 600; color: #334155; margin-bottom: 0.5rem; }
    .card p { color: #64748b; font-size: 0.9rem; }
  `]
})
export class InicioUsuarioComponent {
  private router = inject(Router);

  irCitaMedica() { this.router.navigate(['/usuario/cita-medica']); }
  irCitaEnfermeria() { this.router.navigate(['/usuario/cita-enfermeria']); }
  irFilaVirtual() { this.router.navigate(['/usuario/fila-virtual']); }
}