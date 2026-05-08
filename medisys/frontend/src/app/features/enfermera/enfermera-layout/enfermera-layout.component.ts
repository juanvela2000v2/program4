import { Component } from '@angular/core'
import { RouterLink, RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-enfermera-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div>
      <nav>
        <a routerLink="/enfermera">Inicio</a> |
        <a routerLink="/enfermera/fila">Fila Virtual</a> |
        <a routerLink="/enfermera/almacen">Almacén</a>
      </nav>
      <hr />
      <router-outlet></router-outlet>
    </div>
  `
})
export class EnfermeraLayoutComponent {}