import { Component } from '@angular/core'
import { FilaPublicaComponent } from '../../fila-publica/fila-publica.component'

@Component({
    selector: 'app-fila-usuario',
    standalone: true,
    imports: [FilaPublicaComponent],
    template: `<app-fila-publica></app-fila-publica>`
})
export class FilaUsuarioComponent {}