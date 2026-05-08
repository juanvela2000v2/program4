import { Component, inject, signal, OnInit } from '@angular/core'
import { AdminService } from './../../../core/services/admin.service'
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-admin-especialidades',
  template: `
    <h2>Especialidades</h2>
    <div><input [(ngModel)]="nombre" placeholder="Nombre"/> <button (click)="agregar()">Agregar</button></div>
    <ul>
      @for(e of especialidades(); track e.id){
        <li>{{e.nombre}} <button (click)="eliminar(e.id)">Eliminar</button></li>
      }
    </ul>
  `,
  standalone: true,
  imports: [FormsModule]
})
export class AdminEspecialidadesComponent implements OnInit {
  especialidades = signal<any[]>([])
  nombre = ''
  private svc = inject(AdminService)

  ngOnInit() {
    this.svc.getEspecialidades().subscribe(res => this.especialidades.set(res))
  }

  agregar() {
    this.svc.createEspecialidad(this.nombre).subscribe(() => {
      this.nombre = ''
      this.ngOnInit()
    })
  }

  eliminar(id: number) {
    this.svc.deleteEspecialidad(id).subscribe(() => this.ngOnInit())
  }
}