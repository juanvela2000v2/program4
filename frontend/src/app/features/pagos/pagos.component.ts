import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, NgForOf, DatePipe, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { SessionService } from '../../core/session.service';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [NgIf, NgForOf, DatePipe, FormsModule, RouterLink, AsyncPipe],
  template: `
    <section>
      <h2>Pagos</h2>
      <p>Gestión de pagos y cobros.</p>

      <div *ngIf="session.isLoggedIn()">
        <div *ngIf="pagosGanados.length > 0" class="seccion alerta">
          <h3>Ganastes estas subastas - Pagar!</h3>
          <div *ngFor="let p of pagosGanados" class="pago-card ganado">
            <div class="titulo">{{ p.referenciaTitulo }}</div>
            <div class="monto">\${{ p.monto }}</div>
            <div class="metodo">Metodo: {{ p.metodoPago }}</div>
            <div *ngIf="p.vendedorNombre">Vendedor: {{ p.vendedorNombre }}</div>
            <div class="estado">{{ p.estado }}</div>
            <div class="acciones">
              <button *ngIf="p.estado === 'PENDIENTE'" (click)="marcarPagado(p)">Ya Pague</button>
              <button *ngIf="p.estado === 'PAGADO'" disabled>Esperando confirmacion</button>
            </div>
          </div>
        </div>

        <div *ngIf="vender.length > 0" class="seccion">
          <h3>Tus ventas - Cobrar</h3>
          <div *ngFor="let p of vender" class="pago-card">
            <div class="titulo">{{ p.referenciaTitulo }}</div>
            <div class="monto">\${{ p.monto }}</div>
            <div class="metodo">Metodo: {{ p.metodoPago }}</div>
            <div *ngIf="p.usuarioNombre">Comprador: {{ p.usuarioNombre }}</div>
            <div class="estado">{{ p.estado }}</div>
            <div class="acciones">
              <button *ngIf="p.estado === 'PAGADO'" (click)="confirmarPago(p, 'VALIDADO')">Confirmar Pago</button>
              <button *ngIf="p.estado === 'VALIDADO'" disabled>Confirmado</button>
            </div>
          </div>
        </div>

        <div class="seccion">
          <h3>Todos tus pagos</h3>
          <div *ngIf="todos.length === 0">No hay pagos.</div>
          <div *ngFor="let p of todos" class="pago-card" [class]="p.estado.toLowerCase()">
            <div class="titulo">{{ p.referenciaTitulo }}</div>
            <div class="monto">\${{ p.monto }}</div>
            <div class="tipo">{{ p.referenciaTipo }}</div>
            <div class="metodo">{{ p.metodoPago }}</div>
            <div class="fecha">{{ p.createdAt | date:'dd/MM/yyyy HH:mm' }}</div>
            <div class="estado">{{ p.estado }}</div>
          </div>
        </div>
      </div>

      <div *ngIf="!session.isLoggedIn()" class="login-prompt">
        <p>Para ver pagos <a routerLink="/autenticacion">inicia sesion</a></p>
      </div>
    </section>
  `,
  styles: [`
    .seccion { margin-bottom: 24px; }
    .seccion.alerta { background: #fff3cd; padding: 16px; border-radius: 8px; border: 2px solid #ffc107; }
    .pago-card { border: 1px solid #ddd; padding: 14px; margin: 8px 0; border-radius: 8px; background: white; }
    .pago-card.ganado { border-left: 4px solid #28a745; }
    .pago-card.pendiente { border-left: 4px solid #ffc107; }
    .pago-card.pagado { border-left: 4px solid #17a2b8; }
    .pago-card.validado { border-left: 4px solid #28a745; }
    .titulo { font-weight: bold; font-size: 1.1rem; }
    .monto { font-size: 1.3rem; color: #28a745; font-weight: bold; margin: 8px 0; }
    .metodo, .tipo, .fecha { font-size: 0.85rem; color: #666; }
    .estado { font-weight: bold; margin: 8px 0; }
    .estado.PENDIENTE { color: #ffc107; }
    .estado.PAGADO { color: #17a2b8; }
    .estado.VALIDADO { color: #28a745; }
    .acciones { margin-top: 12px; }
    .acciones button { padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .acciones button:disabled { background: #ccc; cursor: not-allowed; }
    .login-prompt { padding: 24px; text-align: center; background: #f8f9fa; border-radius: 8px; }
  `],
})
export class PagosComponent implements OnInit {
  todos: any[] = [];

  constructor(private api: ApiService, public session: SessionService) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.api.get<any[]>('pagos').subscribe({
      next: data => { this.todos = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); },
    });
  }

  get misPagos() {
    const user = this.session.currentUser$.value;
    return this.todos.filter(p => p.usuarioId === user?.id);
  }

  get pagosGanados() {
    const user = this.session.currentUser$.value;
    return this.todos.filter(p => p.usuarioId === user?.id && p.referenciaTipo === 'SUBASTA' && p.estado === 'PENDIENTE');
  }

  get vender() {
    const user = this.session.currentUser$.value;
    return this.todos.filter(p => p.vendedorId === user?.id && p.referenciaTipo === 'SUBASTA');
  }

  marcarPagado(pago: any) {
    this.api.post('pagos/' + pago._id + '/confirmar', { estado: 'PAGADO' }).subscribe({
      next: () => { this.cargar(); },
    });
  }

  confirmarPago(pago: any, estado: string) {
    this.api.post('pagos/' + pago._id + '/confirmar', { estado }).subscribe({
      next: () => { this.cargar(); },
    });
  }
}