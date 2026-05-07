import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, NgForOf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { SessionService } from '../../core/session.service';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-alertas',
  standalone: true,
  imports: [NgIf, NgForOf, DatePipe, FormsModule, RouterLink],
  template: `
    <section>
      <h2>Alertas Ciudadanas</h2>
      
      <div *ngIf="session.isLoggedIn()">
        <div class="create-alerta" *ngIf="isAdmin">
          <h3>Crear Nueva Alerta</h3>
          <form (ngSubmit)="createAlerta()">
            <label>
              Título:
              <input type="text" [(ngModel)]="newAlerta.titulo" name="titulo" required />
            </label>
            <label>
              Mensaje:
              <textarea [(ngModel)]="newAlerta.mensaje" name="mensaje" required></textarea>
            </label>
            <label>
              Tipo:
              <select [(ngModel)]="newAlerta.tipo" name="tipo">
                <option value="INFO">Información</option>
                <option value="ADVERTENCIA">Advertencia</option>
                <option value="URGENTE">Urgente</option>
                <option value="EMERGENCIA">Emergencia</option>
              </select>
            </label>
            <label>
              Nivel de urgencia:
              <select [(ngModel)]="newAlerta.urgency" name="urgency">
                <option value="BAJA">Baja</option>
                <option value="MEDIA">Media</option>
                <option value="ALTA">Alta</option>
                <option value="CRITICA">Crítica</option>
              </select>
            </label>
            <button type="submit" [disabled]="!newAlerta.titulo || !newAlerta.mensaje">
              Enviar Alerta
            </button>
          </form>
        </div>

        <div class="connection-status">
          <span [class.connected]="socketConnected" [class.disconnected]="!socketConnected">
            {{ socketConnected ? '● En vivo' : '○ Conectando...' }}
          </span>
        </div>

        <h3>Alertas Recientes</h3>
        <div *ngIf="alertas.length === 0">No hay alertas.</div>
        <div class="alertas-list">
          <article class="alerta-card" *ngFor="let alerta of alertas" [class]="alerta.tipo.toLowerCase()">
            <div class="alerta-header">
              <span class="alerta-tipo">{{ alerta.tipo }}</span>
              <span class="alerta-urgency" [class]="alerta.urgency.toLowerCase()">{{ alerta.urgency }}</span>
            </div>
            <h4>{{ alerta.titulo }}</h4>
            <p>{{ alerta.mensaje }}</p>
            <div class="alerta-footer">
              <small>Por: {{ alerta.creadorNombre }}</small>
              <small>{{ alerta.createdAt | date:'dd/MM/yyyy HH:mm' }}</small>
            </div>
            <button *ngIf="!isMyAlert(alerta)" (click)="acknowledgeAlerta(alerta)" class="ack-btn">
              Marcar_leída
            </button>
          </article>
        </div>
      </div>

      <div *ngIf="!session.isLoggedIn()" class="login-prompt">
        <p>Para ver alertas <a routerLink="/autenticacion">inicia sesión</a></p>
      </div>
    </section>
  `,
  styles: [`
    .create-alerta {
      background: #f8f9fa;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
      border: 1px solid #ddd;
    }
    .create-alerta label {
      display: block;
      margin-bottom: 12px;
    }
    .create-alerta textarea {
      width: 100%;
      min-height: 80px;
    }
    .connection-status {
      margin-bottom: 16px;
      font-size: 0.85rem;
    }
    .connection-status .connected { color: #28a745; }
    .connection-status .disconnected { color: #dc3545; }
    .alertas-list {
      display: grid;
      gap: 12px;
    }
    .alerta-card {
      padding: 14px;
      border-radius: 8px;
      border-left: 4px solid #007bff;
      background: #fff;
    }
    .alerta-card.info { border-left-color: #17a2b8; }
    .alerta-card.advertencia { border-left-color: #ffc107; }
    .alerta-card.urgente { border-left-color: #fd7e14; }
    .alerta-card.emergencia { border-left-color: #dc3545; background: #fff5f5; }
    .alerta-header {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }
    .alerta-tipo, .alerta-urgency {
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 4px;
      background: #e9ecef;
    }
    .alerta-urgency.alta { background: #ffc107; color: #000; }
    .alerta-urgency.critica { background: #dc3545; color: #fff; }
    .alerta-card h4 { margin: 0 0 8px 0; }
    .alerta-card p { margin: 0 0 8px 0; }
    .alerta-footer {
      display: flex;
      justify-content: space-between;
      color: #666;
      font-size: 0.85rem;
    }
    .ack-btn {
      margin-top: 8px;
      padding: 4px 12px;
      font-size: 0.85rem;
    }
    .login-prompt {
      padding: 24px;
      text-align: center;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .login-prompt a { color: #007bff; }
  `],
})
export class AlertasComponent implements OnInit, OnDestroy {
  alertas: any[] = [];
  newAlerta = { titulo: '', mensaje: '', tipo: 'INFO', urgency: 'MEDIA' };
  socket: Socket | null = null;
  socketConnected = false;
  isAdmin = false;

  constructor(
    private api: ApiService,
    public session: SessionService,
  ) {}

  ngOnInit() {
    const user = this.session.currentUser$.value;
    this.isAdmin = user?.rol === 'ADMIN' || user?.rol === 'SUPERADMIN';
    this.loadAlertas();
    this.initSocket();
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  loadAlertas() {
    this.api.get<any[]>('alertas').subscribe({
      next: data => {
        this.alertas = data;
      },
    });
  }

  initSocket() {
    this.socket = io('http://localhost:3000/auctions', {
      transports: ['websocket', 'polling'],
      reconnection: true,
    });

    this.socket.on('connect', () => {
      this.socketConnected = true;
    });

    this.socket.on('disconnect', () => {
      this.socketConnected = false;
    });

    this.socket.on('new_alerta', (alerta: any) => {
      this.alertas.unshift(alerta);
    });
  }

  createAlerta() {
    const user = this.session.currentUser$.value;
    const payload = {
      ...this.newAlerta,
      creadorId: user.id,
      creadorNombre: user.nombre,
    };

    this.api.post('alertas', payload).subscribe({
      next: () => {
        this.newAlerta = { titulo: '', mensaje: '', tipo: 'INFO', urgency: 'MEDIA' };
        alert('Alerta enviada');
      },
      error: () => {
        alert('Error al enviar alerta');
      },
    });
  }

  isMyAlert(alerta: any): boolean {
    const user = this.session.currentUser$.value;
    return alerta.creadorId === user?.id;
  }

  acknowledgeAlerta(alerta: any) {
    const user = this.session.currentUser$.value;
    this.socket?.emit('acknowledge_alerta', { alertaId: alerta._id, userId: user?.id });
    window.location.reload();
  }
}
