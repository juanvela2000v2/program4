import { Component } from '@angular/core'

@Component({
    selector: 'app-horarios-doctores',
    standalone: true,
    template: `
        <div class="horarios-container">
            <h2>Horarios de Atención</h2>
            <p class="subtitle">Consulte los horarios de nuestros especialistas</p>

            <div class="especialidad-section">
                <div class="especialidad-header">
                    <i class="bi bi-heart-pulse"></i>
                    <h3>Pediatría</h3>
                </div>
                <div class="doctores-grid">
                    <div class="doctor-card">
                        <div class="doctor-avatar">Dr.</div>
                        <h4>Fernando</h4>
                        <span class="especialidad-badge">Pediatría</span>
                        <div class="horario">
                            <p><i class="bi bi-clock"></i> Lunes a Viernes</p>
                            <p class="hora">08:00 - 14:00</p>
                        </div>
                    </div>
                    <div class="doctor-card">
                        <div class="doctor-avatar">Dr.</div>
                        <h4>Luis</h4>
                        <span class="especialidad-badge">Pediatría</span>
                        <div class="horario">
                            <p><i class="bi bi-clock"></i> Lunes a Viernes</p>
                            <p class="hora">14:00 - 20:00</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="especialidad-section">
                <div class="especialidad-header">
                    <i class="bi bi-heart"></i>
                    <h3>Cardiología</h3>
                </div>
                <div class="doctores-grid">
                    <div class="doctor-card">
                        <div class="doctor-avatar dra">Dra.</div>
                        <h4>Carla</h4>
                        <span class="especialidad-badge">Cardiología</span>
                        <div class="horario">
                            <p><i class="bi bi-clock"></i> Martes y Jueves</p>
                            <p class="hora">08:00 - 16:00</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="especialidad-section">
                <div class="especialidad-header">
                    <i class="bi bi-clipboard2-pulse"></i>
                    <h3>Medicina General</h3>
                </div>
                <div class="doctores-grid">
                    <div class="doctor-card">
                        <div class="doctor-avatar">Dr.</div>
                        <h4>Frank</h4>
                        <span class="especialidad-badge">Medicina General</span>
                        <div class="horario">
                            <p><i class="bi bi-clock"></i> Lunes a Sábado</p>
                            <p class="hora">08:00 - 18:00</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .horarios-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 1rem 0;
        }
        h2 {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 0.3rem;
        }
        .subtitle {
            color: #64748b;
            margin-bottom: 2rem;
        }
        .especialidad-section {
            margin-bottom: 2rem;
        }
        .especialidad-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #e2e8f0;
        }
        .especialidad-header i {
            font-size: 1.5rem;
            color: #2563eb;
        }
        .especialidad-header h3 {
            font-size: 1.3rem;
            font-weight: 700;
            color: #1e293b;
            margin: 0;
        }
        .doctores-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
        }
        .doctor-card {
            background: white;
            border-radius: 1rem;
            padding: 1.5rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            text-align: center;
            transition: transform 0.2s;
        }
        .doctor-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .doctor-avatar {
            width: 4rem;
            height: 4rem;
            border-radius: 50%;
            background: #eff6ff;
            color: #2563eb;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1.2rem;
            margin: 0 auto 0.75rem;
        }
        .doctor-avatar.dra {
            background: #fdf2f8;
            color: #db2777;
        }
        .doctor-card h4 {
            font-size: 1.2rem;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 0.5rem;
        }
        .especialidad-badge {
            display: inline-block;
            padding: 0.3rem 0.8rem;
            background: #eff6ff;
            color: #2563eb;
            border-radius: 1rem;
            font-size: 0.85rem;
            font-weight: 500;
            margin-bottom: 1rem;
        }
        .horario {
            background: #f8fafc;
            border-radius: 0.5rem;
            padding: 0.75rem;
            text-align: left;
        }
        .horario p {
            margin-bottom: 0.2rem;
            color: #64748b;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 0.4rem;
        }
        .hora {
            font-size: 1.1rem !important;
            font-weight: 700;
            color: #1e293b !important;
        }
    `]
})
export class HorariosDoctoresComponent {}