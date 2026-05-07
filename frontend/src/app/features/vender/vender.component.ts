import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { SessionService } from '../../core/session.service';

@Component({
  selector: 'app-vender',
  standalone: true,
  imports: [FormsModule, NgIf],
  template: `
    <section>
      <h2>Vender</h2>

      <div class="tipo-selector">
        <button type="button" (click)="tipo = 'producto'" [class.active]="tipo === 'producto'">Vender Producto</button>
        <button type="button" (click)="tipo = 'servicio'" [class.active]="tipo === 'servicio'">Ofrecer Servicio</button>
      </div>

      <form *ngIf="tipo === 'producto'" (ngSubmit)="venderProducto()">
        <h3>Producto</h3>
        <label>
          Título:
          <input type="text" [(ngModel)]="producto.titulo" name="titulo" required />
        </label>
        <label>
          Descripción:
          <textarea [(ngModel)]="producto.descripcion" name="descripcion" required></textarea>
        </label>
        <label>
          Precio:
          <input type="number" [(ngModel)]="producto.precio" name="precio" required />
        </label>
        <label>
          Categoría:
          <select [(ngModel)]="producto.categoria" name="categoria" required>
            <option value="">Seleccionar</option>
            <option value="electronicos">Electrónicos</option>
            <option value="ropa">Ropa</option>
            <option value="hogar">Hogar</option>
            <option value="deportes">Deportes</option>
            <option value="libros">Libros</option>
            <option value="otros">Otros</option>
          </select>
        </label>
        <button type="submit">Publicar Producto</button>
      </form>

      <form *ngIf="tipo === 'servicio'" (ngSubmit)="ofrecerServicio()">
        <h3>Servicio</h3>
        <label>
          Tipo:
          <select [(ngModel)]="servicio.tipo" name="tipo" required>
            <option value="OFRECER">Ofrecer Servicio</option>
            <option value="BUSCAR">Buscar Servicio</option>
          </select>
        </label>
        <label>
          Título:
          <input type="text" [(ngModel)]="servicio.titulo" name="titulo" required />
        </label>
        <label>
          Descripción:
          <textarea [(ngModel)]="servicio.descripcion" name="descripcion" required></textarea>
        </label>
        <label>
          Categoría:
          <select [(ngModel)]="servicio.categoria" name="categoria" required>
            <option value="">Seleccionar</option>
            <option value="albañil">Albañil</option>
            <option value="plomero">Plomero</option>
            <option value="arquitecto">Arquitecto</option>
            <option value="electricista">Electricista</option>
            <option value="jardinero">Jardinero</option>
            <option value="programador">Programador</option>
            <option value="otros">Otros</option>
          </select>
        </label>
        <label>
          Precio (opcional):
          <input type="number" [(ngModel)]="servicio.precio" name="precio" />
        </label>
        <button type="submit">Publicar Servicio</button>
      </form>
    </section>
  `,
  styles: [
    `
      .tipo-selector {
        margin-bottom: 20px;
      }
      .tipo-selector button {
        margin-right: 10px;
        padding: 10px 20px;
        border: 1px solid #007bff;
        background: white;
        color: #007bff;
        cursor: pointer;
      }
      .tipo-selector button.active {
        background: #007bff;
        color: white;
      }
      form {
        max-width: 600px;
      }
      label {
        display: block;
        margin-bottom: 15px;
      }
      input, textarea, select {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      textarea {
        height: 100px;
      }
      button[type="submit"] {
        padding: 10px 20px;
        background: #28a745;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
    `,
  ],
})
export class VenderComponent {
  tipo = 'producto';
  producto = {
    titulo: '',
    descripcion: '',
    precio: 0,
    categoria: '',
  };
  servicio = {
    tipo: 'OFRECER',
    titulo: '',
    descripcion: '',
    categoria: '',
    precio: null,
  };

  constructor(private api: ApiService, private router: Router, private session: SessionService) {}

  venderProducto() {
    const token = this.session.getToken();
    if (!token) {
      alert('Debes iniciar sesión antes de publicar un producto.');
      this.router.navigate(['/autenticacion']);
      return;
    }

    this.api.post('productos', this.producto, token).subscribe({
      next: () => {
        alert('Producto publicado');
        this.router.navigate(['/mercado']);
      },
      error: (err) => alert('Error: ' + (err?.error?.message || err.message || 'No autorizado')),
    });
  }

  ofrecerServicio() {
    const token = this.session.getToken();
    if (!token) {
      alert('Debes iniciar sesión antes de publicar un servicio.');
      this.router.navigate(['/autenticacion']);
      return;
    }

    this.api.post('servicios', this.servicio, token).subscribe({
      next: () => {
        alert('Servicio publicado');
        this.router.navigate(['/mercado']);
      },
      error: (err) => alert('Error: ' + (err?.error?.message || err.message || 'No autorizado')),
    });
  }
}