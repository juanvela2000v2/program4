import { Component } from '@angular/core'
import { RouterLink, RouterOutlet } from '@angular/router'

@Component({
    selector: 'app-medico-layout',
    standalone: true,
    imports: [RouterOutlet, RouterLink],
    template: `
        <nav>
            <a routerLink="/medico">Inicio</a> |
            <a routerLink="/medico/fila">Fila Virtual</a> |
            <a routerLink="/medico/diagnostico">Diagnóstico</a> |
            <a routerLink="/medico/receta">Receta</a> |
            <a routerLink="/medico/historial">Historial Clínico</a>
        </nav>
        <hr />
        <router-outlet></router-outlet>
    `
})
export class MedicoLayoutComponent {}