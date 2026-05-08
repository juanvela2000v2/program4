import { Component } from '@angular/core'

@Component({
    selector: 'app-medico-inicio',
    standalone: true,
    template: `
        <div class="inicio-container">
            <div class="welcome-card">
                <div class="welcome-icon">
                    <i class="bi bi-heart-pulse"></i>
                </div>
                <h2>Bienvenido Doctor</h2>
                <p class="text-muted">Seleccione una opción para comenzar</p>
            </div>

            <div class="cards-grid">
                <div class="card" routerLink="/medico/fila">
                    <div class="card-icon blue">
                        <i class="bi bi-people-fill"></i>
                    </div>
                    <h3>Fila Virtual</h3>
                    <p>Atienda a los pacientes en espera</p>
                </div>

                <div class="card" routerLink="/medico/diagnostico">
                    <div class="card-icon green">
                        <i class="bi bi-clipboard2-pulse"></i>
                    </div>
                    <h3>Diagnóstico</h3>
                    <p>Registre diagnósticos médicos</p>
                </div>

                <div class="card" routerLink="/medico/receta">
                    <div class="card-icon purple">
                        <i class="bi bi-prescription2"></i>
                    </div>
                    <h3>Receta Médica</h3>
                    <p>Genere recetas para sus pacientes</p>
                </div>

                <div class="card" routerLink="/medico/historial">
                    <div class="card-icon orange">
                        <i class="bi bi-clock-history"></i>
                    </div>
                    <h3>Historial Clínico</h3>
                    <p>Consulte el historial por CI</p>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .inicio-container { padding: 1rem 0; }
        .welcome-card { text-align: center; margin-bottom: 2.5rem; }
        .welcome-icon {
            width: 5rem; height: 5rem; background: #2563eb; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 1.5rem; color: white; font-size: 2.5rem;
        }
        .welcome-card h2 { font-size: 1.8rem; font-weight: 700; color: #1e293b; margin-bottom: 0.3rem; }
        .text-muted { color: #64748b; font-size: 1.1rem; }
        .cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; }
        .card {
            background: white; border-radius: 1rem; padding: 2rem 1.5rem; text-align: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
            text-decoration: none; display: block;
        }
        .card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0,0,0,0.08); }
        .card-icon {
            width: 3.5rem; height: 3.5rem; border-radius: 50%; display: flex;
            align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 1.8rem;
        }
        .blue { background: #eff6ff; color: #2563eb; }
        .green { background: #f0fdf4; color: #059669; }
        .purple { background: #f5f3ff; color: #7c3aed; }
        .orange { background: #fff7ed; color: #ea580c; }
        .card h3 { font-size: 1.2rem; font-weight: 600; color: #334155; margin-bottom: 0.5rem; }
        .card p { color: #64748b; font-size: 0.9rem; }
    `]
})
export class MedicoInicioComponent {}