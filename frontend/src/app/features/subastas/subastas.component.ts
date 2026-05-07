import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { SessionService } from '../../core/session.service';
import { io, Socket } from 'socket.io-client';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-subastas',
  standalone: true,
  imports: [NgIf, NgForOf, FormsModule, RouterLink],
  template: `
    <section>
      <h2>Subastas</h2>
      <div *ngIf="session.isLoggedIn()">
        <div class="form">
          <h3>Crear</h3>
          <input type="text" [(ngModel)]="nueva.titulo" placeholder="Titulo" required />
          <textarea [(ngModel)]="nueva.descripcion" placeholder="Descripcion"></textarea>
          <select [(ngModel)]="nueva.categoria">
            <option value="PRODUCTO">Producto</option>
            <option value="ROPA">Ropa</option>
            <option value="SERVICIO">Servicio</option>
            <option value="OTRO">Otro</option>
          </select>
          <input type="text" [(ngModel)]="nueva.imagen" placeholder="Imagen URL" />
          <input type="number" [(ngModel)]="nueva.precioInicial" placeholder="Precio inicial" min="1" required />
          <input type="number" [(ngModel)]="nueva.incrementoMinimo" placeholder="Incremento minimo" min="1" value="1" />
          <input type="number" [(ngModel)]="nueva.duracionSegundos" placeholder="Duracion seg" value="30" />
          <button (click)="crear()">Crear</button>
        </div>
        <p *ngIf="errorMsg">{{ errorMsg }}</p>
        <div class="status">En vivo: {{ socketConnected ? 'SI' : 'NO' }}</div>
        
        <h3>Mis Subastas</h3>
        <div class="grid">
          <div *ngFor="let s of misSubastas" class="card">
            <img *ngIf="s.imagen" [src]="s.imagen" />
            <h4>{{ s.titulo }}</h4>
            <div>{{ s.categoria }}</div>
            <div>{{ s.descripcion }}</div>
            <div class="price">\${{ s.precioActual }}</div>
            <div *ngIf="s.estado === 'ACTIVA'">{{ getTime(s.fechaFin) }}s</div>
            <div>{{ s.estado }}</div>
            <div *ngIf="s.pujadorActualNombre">Lider: {{ s.pujadorActualNombre }}</div>
            <button *ngIf="s.estado === 'ESPERANDO'" (click)="iniciar(s._id)">EMPEZAR</button>
            <div *ngIf="s.estado === 'ACTIVA'">
              <div class="puja-box">
                +{{ s.incrementoMinimo || 1 }}
                <input type="number" [(ngModel)]="s.montoInput" [min]="s.precioActual + (s.incrementoMinimo || 1)" />
                <button (click)="pujar(s)" [disabled]="!s.montoInput">PUJAR</button>
                <button (click)="pujarRapido(s)" class="btn-rapido">+{{ s.incrementoMinimo || 1 }}</button>
              </div>
            </div>
          </div>
        </div>

        <h3>Todas</h3>
        <div class="grid">
          <div *ngFor="let s of subastas" class="card">
            <img *ngIf="s.imagen" [src]="s.imagen" />
            <h4>{{ s.titulo }}</h4>
            <div>{{ s.categoria }}</div>
            <div class="price">\${{ s.precioActual }}</div>
            <div *ngIf="s.pujadorActualNombre">Lider: {{ s.pujadorActualNombre }}</div>
            <div *ngIf="s.estado === 'ACTIVA'">{{ getTime(s.fechaFin) }}s</div>
            <div>{{ s.estado }}</div>
            <div *ngIf="s.estado === 'ACTIVA'">
              <div class="puja-box">
                Minimo: +{{ s.incrementoMinimo || 1 }}
                <input type="number" [(ngModel)]="s.montoInput" [min]="s.precioActual + (s.incrementoMinimo || 1)" />
                <button (click)="pujar(s)" [disabled]="!s.montoInput">PUJAR</button>
                <button (click)="pujarRapido(s)" class="btn-rapido">+{{ s.incrementoMinimo || 1 }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div *ngIf="!session.isLoggedIn()">
        <a routerLink="/autenticacion">Iniciar sesion</a>
      </div>
    </section>
  `,
  styles: [`
    .form input, .form textarea, .form select { display: block; margin: 8px 0; padding: 8px; width: 100%; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
    .card { border: 1px solid #ddd; padding: 12px; }
    .card img { width: 100%; height: 80px; object-fit: cover; }
    .price { font-weight: bold; color: #28a745; }
    .puja-box { display: flex; gap: 4px; flex-wrap: wrap; }
    .puja-box input { width: 80px; }
    .btn-rapido { background: #28a745; color: white; }
  `],
})
export class SubastasComponent implements OnInit, OnDestroy {
  subastas: any[] = [];
  misSubastas: any[] = [];
nueva = { titulo: '', descripcion: '', categoria: 'PRODUCTO', imagen: '', precioInicial: 0, duracionSegundos: 30, incrementoMinimo: 1 };
  socket: Socket | null = null;
  socketConnected = false;
  timer: Subscription | null = null;
  errorMsg = '';
  userId = '';

  constructor(private api: ApiService, public session: SessionService) {}

  ngOnInit() {
    const user = this.session.currentUser$.value;
    this.userId = user?.id || '';
    this.cargar();
    this.initSocket();
    this.timer = interval(1000).subscribe(() => {});
  }

  ngOnDestroy() {
    this.socket?.disconnect();
    this.timer?.unsubscribe();
  }

  cargar() {
    this.errorMsg = '';
    this.api.get<any[]>('subastas').subscribe({
      next: data => {
        console.log('Subastas cargadas:', data);
        this.subastas = data;
        this.misSubastas = data.filter((s: any) => s.creadorId === this.userId);
      },
      error: (err) => { 
        console.error('Error cargar:', err);
        this.errorMsg = 'Error'; 
      },
    });
  }

  initSocket() {
    this.socket = io('http://localhost:3000/auctions');
    this.socket.on('connect', () => { this.socketConnected = true; });
    this.socket.on('disconnect', () => { this.socketConnected = false; });
    this.socket.on('auction_bid', (data: any) => {
      if (data.type === 'NUEVA_PUJA') {
        const idx = this.subastas.findIndex((s: any) => s._id === data.subastaId);
        if (idx >= 0) { this.subastas[idx].precioActual = data.precioActual; this.subastas[idx].pujadorActualNombre = data.pujadorNombre; }
      } else if (data.type === 'SUBASTA_INICIADA' || data.type === 'SUBASTA_FINALIZADA') { this.cargar(); }
    });
  }

  crear() {
    this.errorMsg = '';
    if (!this.nueva.titulo || !this.nueva.precioInicial) {
      this.errorMsg = 'Titulo y precio obligatorios';
      return;
    }
    console.log('Creando subasta:', this.nueva);
    this.api.post('subastas', this.nueva).subscribe({
      next: (res) => {
        console.log('Subasta creada:', res);
        this.nueva = { titulo: '', descripcion: '', categoria: 'PRODUCTO', imagen: '', precioInicial: 0, duracionSegundos: 30, incrementoMinimo: 1 };
        this.cargar();
      },
      error: (err) => { 
        console.error('Error crear:', err);
        this.errorMsg = 'Error: ' + (err.message || 'No se pudo crear'); 
      },
    });
  }

  iniciar(id: string) {
    this.api.post('subastas/' + id + '/iniciar', {}).subscribe({
      next: () => { this.cargar(); },
      error: () => { this.errorMsg = 'Error'; },
    });
  }

  pujar(s: any) {
    this.errorMsg = '';
    if (!s.montoInput || s.montoInput <= s.precioActual) {
      this.errorMsg = 'Monto mayor';
      return;
    }
    this.api.post('subastas/' + s._id + '/pujar', { monto: s.montoInput }).subscribe({
      next: () => { s.montoInput = 0; this.cargar(); },
      error: () => { this.errorMsg = 'Error'; },
    });
  }

  pujarRapido(s: any) {
    const incremento = s.incrementoMinimo || 1;
    const monto = s.precioActual + incremento;
    this.api.post('subastas/' + s._id + '/pujar', { monto }).subscribe({
      next: () => { this.cargar(); },
      error: () => { this.errorMsg = 'Error'; },
    });
  }

  getTime(fechaFin: string): number {
    if (!fechaFin) return 0;
    return Math.max(0, Math.ceil((new Date(fechaFin).getTime() - Date.now()) / 1000));
  }
}