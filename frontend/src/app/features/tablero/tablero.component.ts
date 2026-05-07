import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf, NgForOf, DatePipe, AsyncPipe } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { SessionService } from '../../core/session.service';

@Component({
  selector: 'app-tablero',
  standalone: true,
  imports: [NgIf, NgForOf, DatePipe, RouterLink, AsyncPipe],
  template: `
    <section>
      <h2>Notificaciones</h2>
      
      <div *ngIf="session.isLoggedIn()">
        <div *ngIf="chats.length === 0" class="vacio">
          No hay mensajes nuevos.
        </div>
        
        <div *ngFor="let chat of chats" class="chat-item" (click)="abrirChat(chat)">
          <div class="chat-producto">{{ chat.productoTitulo }}</div>
          <div class="chat-otro">
            <span *ngIf="chat.compradorId === userId">De: {{ chat.compradorNombre }}</span>
            <span *ngIf="chat.compradorId !== userId">Para: {{ chat.vendedorNombre }}</span>
          </div>
          <div class="chat-fecha">{{ chat.updatedAt | date:'dd/MM HH:mm' }}</div>
          <div class="chat-badge" *ngIf="chat.sinLeer > 0">{{ chat.sinLeer }} nuevo(s)</div>
        </div>
      </div>
      
      <div *ngIf="!session.isLoggedIn()" class="login-prompt">
        <a routerLink="/autenticacion">Iniciar sesion</a>
      </div>
    </section>
  `,
  styles: [`
    .vacio { padding: 24px; text-align: center; color: #666; }
    .chat-item {
      border: 1px solid #ddd;
      padding: 14px;
      margin: 8px 0;
      border-radius: 8px;
      cursor: pointer;
      background: white;
    }
    .chat-item:hover { background: #f8f9fa; }
    .chat-producto { font-weight: bold; font-size: 1.1rem; }
    .chat-otro { color: #666; margin: 4px 0; }
    .chat-fecha { font-size: 0.8rem; color: #999; }
    .chat-badge {
      background: #dc3545;
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      display: inline-block;
      margin-top: 4px;
    }
    .login-prompt { padding: 24px; text-align: center; background: #f8f9fa; border-radius: 8px; }
  `],
})
export class TableroComponent implements OnInit {
  chats: any[] = [];
  userId = '';

  constructor(
    private api: ApiService,
    public session: SessionService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.session.currentUser$.value;
    this.userId = user?.id || '';
    this.cargarChats();
  }

  cargarChats() {
    this.api.get<any[]>('chat/mis-chats').subscribe({
      next: data => {
        this.chats = data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      },
    });
  }

  abrirChat(chat: any) {
    this.router.navigate(['/producto', chat.productoId]);
  }
}