import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf, NgForOf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { SessionService } from '../../core/session.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [NgIf, NgForOf, DatePipe, FormsModule, RouterLink],
  template: `
    <section *ngIf="producto">
      <h2>{{ producto.titulo }}</h2>

      <div class="producto-info">
        <div class="vendedor-info">
          <img *ngIf="producto.vendedor?.avatar" [src]="producto.vendedor.avatar" alt="Avatar vendedor" />
          <strong>Vendedor:</strong> {{ producto.vendedor?.nombre }}
        </div>

        <div class="producto-detalles">
          <p><strong>Precio:</strong> \${{ producto.precio }}</p>
          <p><strong>Estado:</strong> {{ producto.estado }}</p>
        </div>

        <div class="descripcion">
          <h3>Descripción</h3>
          <p>{{ producto.descripcion }}</p>
        </div>
      </div>

      <div class="chat-section">
        <h3>Chat: {{ producto.titulo }}</h3>
        
        <div *ngIf="!session.isLoggedIn()" class="login-prompt">
          <p>Para chatear necesitas <a routerLink="/autenticacion">iniciar sesión</a></p>
        </div>

        <div *ngIf="session.isLoggedIn() && chatId">
          <div class="chat-messages" #messagesContainer>
            <div *ngFor="let msg of messages" class="message" [class.own]="msg.emisorId === currentUserId">
              <div class="message-content">
                <strong>{{ msg.emisorNombre }}:</strong> {{ msg.contenido }}
              </div>
              <small>{{ msg.createdAt | date:'HH:mm' }}</small>
            </div>
            <div *ngIf="messages.length === 0" class="no-messages">
              Aún no hay mensajes. ¡Inicia la conversación!
            </div>
          </div>

          <div class="chat-input">
            <input type="text" [(ngModel)]="newMessage" (keyup.enter)="sendMessage()" placeholder="Escribe tu mensaje..." />
            <button (click)="sendMessage()" [disabled]="!newMessage.trim()">Enviar</button>
          </div>
        </div>

        <div *ngIf="session.isLoggedIn() && !chatId && cargandoChat">
          <p>Cargando chat...</p>
        </div>
      </div>

      <button (click)="goBack()">Volver al mercado</button>
    </section>

    <section *ngIf="!producto && !error">
      <p>Cargando producto...</p>
    </section>

    <section *ngIf="error">
      <p class="error">{{ error }}</p>
      <button (click)="goBack()">Volver al mercado</button>
    </section>
  `,
  styles: [`
    .producto-info { display: grid; gap: 16px; margin-bottom: 24px; }
    .vendedor-info { display: flex; align-items: center; gap: 12px; }
    .vendedor-info img { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; }
    .producto-detalles { display: grid; gap: 8px; }
    .chat-section { border: 1px solid #ddd; padding: 16px; border-radius: 8px; margin-bottom: 16px; }
    .login-prompt { padding: 16px; background: #fff3cd; border-radius: 4px; text-align: center; }
    .login-prompt a { color: #007bff; text-decoration: underline; }
    .chat-messages { height: 300px; overflow-y: auto; border: 1px solid #eee; padding: 12px; margin-bottom: 12px; background: #fafafa; display: flex; flex-direction: column; }
    .message { margin-bottom: 8px; padding: 8px; border-radius: 4px; background: #fff; max-width: 80%; }
    .message.own { align-self: flex-end; background: #e3f2fd; }
    .message-content { word-break: break-word; }
    .no-messages { color: #666; text-align: center; margin-top: auto; margin-bottom: auto; }
    .chat-input { display: flex; gap: 8px; }
    .chat-input input { flex: 1; padding: 8px; }
    .error { color: #dc3545; }
  `],
})
export class ProductoDetalleComponent implements OnInit, OnDestroy {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  
  producto: any = null;
  messages: any[] = [];
  newMessage = '';
  chatId: string | null = null;
  currentUserId: string | null = null;
  error: string | null = null;
  cargandoChat = false;
  private pollSub: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    public session: SessionService,
  ) {}

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    }
  }

  ngOnDestroy() {
    this.pollSub?.unsubscribe();
  }

  loadProduct(id: string) {
    this.api.get<any>(`productos/${id}`).subscribe({
      next: data => {
        this.producto = data;
        if (this.session.isLoggedIn()) {
          this.initChat();
        }
      },
      error: () => {
        this.error = 'Producto no encontrado';
      },
    });
  }

  initChat() {
    const user = this.session.currentUser$.value;
    this.currentUserId = user?.id;
    this.cargandoChat = true;

    this.api.post<any>('chat/iniciar', {
      productoId: this.producto._id,
      productoTitulo: this.producto.titulo,
      vendedorId: this.producto.usuarioId || this.producto.vendedor?._id,
      vendedorNombre: this.producto.vendedor?.nombre || 'Vendedor',
    }).subscribe({
      next: chat => {
        this.chatId = chat._id;
        this.cargandoChat = false;
        this.cargarMensajes();
        this.pollSub = interval(3000).subscribe(() => this.cargarMensajes());
      },
      error: () => {
        this.cargandoChat = false;
      },
    });
  }

  cargarMensajes() {
    if (!this.chatId) return;
    this.api.get<any[]>(`chat/${this.chatId}/mensajes`).subscribe({
      next: data => {
        this.messages = data;
        setTimeout(() => this.scrollToBottom(), 100);
      },
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.chatId) return;

    const user = this.session.currentUser$.value;
    this.api.post(`chat/${this.chatId}/mensajes`, { contenido: this.newMessage.trim() }).subscribe({
      next: () => {
        this.newMessage = '';
        this.cargarMensajes();
      },
    });
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  goBack() {
    this.router.navigate(['/mercado']);
  }
}