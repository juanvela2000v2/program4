import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { SessionService } from '../../core/session.service';

@Component({
  selector: 'app-mercado',
  standalone: true,
  imports: [NgIf, NgForOf],
  template: `
    <section>
      <h2>Mercado</h2>
      <p>Explora productos y servicios disponibles.</p>

      <div *ngIf="session.isLoggedIn()">
        <button (click)="irAVender()">Vender</button>
      </div>

      <div *ngIf="cargando">Cargando...</div>

      <h3>Productos</h3>
      <div *ngIf="!cargando && productos.length === 0">No hay productos disponibles aún.</div>
      <div class="productos-grid" *ngIf="!cargando && productos.length > 0">
        <article class="producto-card" *ngFor="let producto of productos">
          <div class="producto-avatar" *ngIf="producto.vendedorAvatar">
            <img [src]="producto.vendedorAvatar" alt="Avatar vendedor" />
          </div>
          <h3>{{ producto.titulo }}</h3>
          <div class="producto-meta">
            <strong>Precio:</strong> \${{ producto.precio }}
          </div>
          <p>{{ producto.descripcion }}</p>
          <div class="producto-vendedor">
            <strong>Vende:</strong> {{ producto.vendedorNombre || producto.usuarioId }}
          </div>
          <div class="producto-info">
            <strong>Estado:</strong> {{ producto.estado }} •
            <strong>Validado:</strong> {{ producto.validado ? 'Sí' : 'No' }}
          </div>
          <div class="acciones">
            <button type="button" (click)="verProducto(producto._id)">Ver Detalle</button>
            <button type="button" (click)="comprar(producto)">Comprar</button>
            <button type="button" (click)="chat(producto)">Chat</button>
          </div>
        </article>
      </div>

      <h3>Servicios</h3>
      <div *ngIf="!cargando && servicios.length === 0">No hay servicios disponibles aún.</div>
      <div class="productos-grid" *ngIf="!cargando && servicios.length > 0">
        <article class="producto-card" *ngFor="let servicio of servicios">
          <div class="producto-avatar" *ngIf="servicio.proveedorAvatar">
            <img [src]="servicio.proveedorAvatar" alt="Avatar proveedor" />
          </div>
          <h3>{{ servicio.titulo }}</h3>
          <div class="producto-meta">
            <strong>Tipo:</strong> {{ servicio.tipo }} •
            <strong>Categoría:</strong> {{ servicio.categoria }}
            <span *ngIf="servicio.precio"> • <strong>Precio:</strong> \${{ servicio.precio }}</span>
          </div>
          <p>{{ servicio.descripcion }}</p>
          <div class="producto-vendedor">
            <strong>Proveedor:</strong> {{ servicio.proveedorNombre || servicio.usuarioId }}
          </div>
          <div class="producto-info">
            <strong>Estado:</strong> {{ servicio.estado }} •
            <strong>Validado:</strong> {{ servicio.validado ? 'Sí' : 'No' }}
          </div>
          <div class="acciones">
            <button type="button" (click)="verServicio(servicio._id)">Ver Detalle</button>
            <button type="button" (click)="contactar(servicio)">Contactar</button>
          </div>
        </article>
      </div>
    </section>
  `,
  styles: [
    `
      .productos-grid {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      }
      .producto-card {
        border: 1px solid #ddd;
        padding: 14px;
        border-radius: 8px;
        background: white;
      }
      .producto-avatar img {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
        margin-bottom: 12px;
      }
      .producto-meta,
      .producto-vendedor,
      .producto-info {
        font-size: 0.95rem;
        margin-bottom: 8px;
      }
      .acciones {
        margin-top: 12px;
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .acciones button {
        padding: 6px 12px;
        border: 1px solid #007bff;
        background: white;
        color: #007bff;
        border-radius: 4px;
        cursor: pointer;
      }
      .acciones button:hover {
        background: #007bff;
        color: white;
      }
    `,
  ],
})
export class MercadoComponent implements OnInit {
  productos: any[] = [];
  servicios: any[] = [];
  cargando = true;

  constructor(private readonly api: ApiService, private readonly router: Router, public readonly session: SessionService) {}

  ngOnInit() {
    this.cargarProductos();
    this.cargarServicios();
  }

  cargarProductos() {
    this.api.get<any[]>('productos').subscribe({
      next: data => {
        this.productos = data;
        this.cargando = false;
      },
      error: () => {
        this.productos = [];
        this.cargando = false;
      },
    });
  }

  cargarServicios() {
    this.api.get<any[]>('servicios').subscribe({
      next: data => {
        this.servicios = data;
      },
      error: () => {
        this.servicios = [];
      },
    });
  }

  irAVender() {
    this.router.navigate(['/vender']);
  }

  verProducto(id: string) {
    this.router.navigate(['/producto', id]);
  }

  verServicio(id: string) {
    // Por ahora, navegar a una página similar, o crear una nueva
    this.router.navigate(['/servicio', id]);
  }

  comprar(producto: any) {
    // Lógica para comprar, quizás abrir un modal o navegar a pagos
    alert(`Comprar ${producto.titulo}`);
  }

  chat(producto: any) {
    // Navegar al detalle del producto donde está el chat
    this.router.navigate(['/producto', producto._id]);
  }

  contactar(servicio: any) {
    // Similar al chat, pero para servicios
    alert(`Contactar para ${servicio.titulo}`);
  }
}
