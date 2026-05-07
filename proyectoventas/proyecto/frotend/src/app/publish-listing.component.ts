import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

type ListingType = 'job' | 'real_estate_sale' | 'rent' | 'anticretico' | 'product';

@Component({
  selector: 'app-publish-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen) {
      <div class="modal-overlay" (click)="close()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <button class="modal-close" (click)="close()">✕</button>
          <div class="modal-body">
            <h2>Publicar anuncio</h2>

            <div class="form-group">
              <label>Tipo de anuncio</label>
              <select [(ngModel)]="selectedType" name="type" (change)="clearForm()">
                <option value="job">Trabajos</option>
                <option value="real_estate_sale">Ventas</option>
                <option value="rent">Alquileres</option>
                <option value="anticretico">Anticreticos</option>
                <option value="product">Bienes</option>
              </select>
            </div>

            <form (submit)="submit($event)" class="form-content">
              <div class="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  [(ngModel)]="formData.name"
                  name="name"
                  placeholder="Tu nombre completo"
                  required
                />
              </div>

              <div class="form-group">
                <label>Número de celular</label>
                <input
                  type="tel"
                  [(ngModel)]="formData.phone"
                  name="phone"
                  placeholder="Ej: +591 73456789"
                  required
                />
              </div>

              @switch (selectedType) {
                @case ('job') {
                  <div class="form-group">
                    <label>Título del trabajo</label>
                    <input
                      type="text"
                      [(ngModel)]="formData.title"
                      name="title"
                      placeholder="Ej: Desarrollador Full Stack"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label>Descripción</label>
                    <textarea
                      [(ngModel)]="formData.description"
                      name="description"
                      placeholder="Describe el trabajo, requisitos, etc."
                      rows="5"
                      required
                    ></textarea>
                  </div>
                }
                @case ('real_estate_sale') {
                  <div class="form-group">
                    <label>Descripción del inmueble</label>
                    <input
                      type="text"
                      [(ngModel)]="formData.title"
                      name="title"
                      placeholder="Ej: Casa 3 dormitorios, cocina amueblada"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label>Detalles</label>
                    <textarea
                      [(ngModel)]="formData.description"
                      name="description"
                      placeholder="Describe la propiedad, ubicación, características, etc."
                      rows="5"
                      required
                    ></textarea>
                  </div>
                  <div class="form-group">
                    <label>Precio (en Bs.)</label>
                    <input
                      type="number"
                      [(ngModel)]="formData.price"
                      name="price"
                      placeholder="Ej: 250000"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label>Imagen</label>
                    <input
                      type="file"
                      (change)="onImageSelected($event)"
                      accept="image/*"
                      required
                    />
                    @if (formData.image) {
                      <div class="image-preview">
                        <img [src]="formData.image" alt="Vista previa" />
                      </div>
                    }
                  </div>
                }
                @case ('rent') {
                  <div class="form-group">
                    <label>Descripción del inmueble</label>
                    <input
                      type="text"
                      [(ngModel)]="formData.title"
                      name="title"
                      placeholder="Ej: Departamento 2 dormitorios"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label>Detalles</label>
                    <textarea
                      [(ngModel)]="formData.description"
                      name="description"
                      placeholder="Describe la propiedad, ubicación, características, etc."
                      rows="5"
                      required
                    ></textarea>
                  </div>
                  <div class="form-group">
                    <label>Precio de alquiler (en Bs./mes)</label>
                    <input
                      type="number"
                      [(ngModel)]="formData.price"
                      name="price"
                      placeholder="Ej: 5000"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label>Imagen</label>
                    <input
                      type="file"
                      (change)="onImageSelected($event)"
                      accept="image/*"
                      required
                    />
                    @if (formData.image) {
                      <div class="image-preview">
                        <img [src]="formData.image" alt="Vista previa" />
                      </div>
                    }
                  </div>
                }
                @case ('anticretico') {
                  <div class="form-group">
                    <label>Descripción del inmueble</label>
                    <input
                      type="text"
                      [(ngModel)]="formData.title"
                      name="title"
                      placeholder="Ej: Casa con patio, 4 dormitorios"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label>Detalles</label>
                    <textarea
                      [(ngModel)]="formData.description"
                      name="description"
                      placeholder="Describe la propiedad, ubicación, características, etc."
                      rows="5"
                      required
                    ></textarea>
                  </div>
                  <div class="form-group">
                    <label>Monto a invertir (en Bs.)</label>
                    <input
                      type="number"
                      [(ngModel)]="formData.price"
                      name="price"
                      placeholder="Ej: 100000"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label>Imagen</label>
                    <input
                      type="file"
                      (change)="onImageSelected($event)"
                      accept="image/*"
                      required
                    />
                    @if (formData.image) {
                      <div class="image-preview">
                        <img [src]="formData.image" alt="Vista previa" />
                      </div>
                    }
                  </div>
                }
                @case ('product') {
                  <div class="form-group">
                    <label>Nombre del bien</label>
                    <input
                      type="text"
                      [(ngModel)]="formData.title"
                      name="title"
                      placeholder="Ej: Motocicleta Yamaha YZF R3"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label>Descripción</label>
                    <textarea
                      [(ngModel)]="formData.description"
                      name="description"
                      placeholder="Describe el bien, estado, características, etc."
                      rows="5"
                      required
                    ></textarea>
                  </div>
                  <div class="form-group">
                    <label>Precio (en Bs.)</label>
                    <input
                      type="number"
                      [(ngModel)]="formData.price"
                      name="price"
                      placeholder="Ej: 15000"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label>Imagen</label>
                    <input
                      type="file"
                      (change)="onImageSelected($event)"
                      accept="image/*"
                      required
                    />
                    @if (formData.image) {
                      <div class="image-preview">
                        <img [src]="formData.image" alt="Vista previa" />
                      </div>
                    }
                  </div>
                }
              }

              @if (successMessage()) {
                <div class="success-message">{{ successMessage() }}</div>
              }

              @if (errorMessage()) {
                <div class="error-message">{{ errorMessage() }}</div>
              }

              <button type="submit" [disabled]="isLoading()">
                @if (isLoading()) {
                  Publicando...
                } @else {
                  Publicar anuncio
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999;
      overflow-y: auto;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideIn 0.3s ease-out;
      max-width: 600px;
      width: 90%;
      position: relative;
      margin: 20px auto;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-close {
      position: absolute;
      top: 16px;
      right: 16px;
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #6b7280;
      transition: color 0.2s;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-close:hover {
      color: #111827;
    }

    .modal-body {
      padding: 32px;
    }

    h2 {
      margin: 0 0 24px;
      font-size: 24px;
      color: #1f2937;
    }

    .form-group {
      margin-bottom: 16px;
      display: flex;
      flex-direction: column;
    }

    label {
      margin-bottom: 6px;
      font-weight: 500;
      color: #374151;
      font-size: 14px;
    }

    input,
    select,
    textarea {
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
      transition: border-color 0.2s;
    }

    input:focus,
    select:focus,
    textarea:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    textarea {
      resize: vertical;
    }

    .image-preview {
      margin-top: 12px;
      border-radius: 4px;
      overflow: hidden;
      max-width: 200px;
    }

    .image-preview img {
      width: 100%;
      height: auto;
      display: block;
    }

    .success-message {
      padding: 12px;
      background: #dcfce7;
      color: #166534;
      border-radius: 4px;
      margin-bottom: 16px;
      font-size: 14px;
    }

    .error-message {
      padding: 12px;
      background: #fee2e2;
      color: #991b1b;
      border-radius: 4px;
      margin-bottom: 16px;
      font-size: 14px;
    }

    .form-content {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    button[type="submit"] {
      padding: 10px 16px;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
      margin-top: 8px;
    }

    button[type="submit"]:hover:not(:disabled) {
      background: #1d4ed8;
    }

    button[type="submit"]:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  `],
})
export class PublishModalComponent {
  @Input() isOpen = false;
  @Output() closeEvent = new EventEmitter<void>();

  readonly isLoading = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');

  selectedType: ListingType = 'job';
  formData = {
    name: '',
    phone: '',
    title: '',
    description: '',
    price: 0,
    image: '',
  };

  constructor(
    readonly authService: AuthService,
    private http: HttpClient,
  ) {}

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.formData.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  clearForm() {
    this.formData = {
      name: '',
      phone: '',
      title: '',
      description: '',
      price: 0,
      image: '',
    };
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  submit(e: Event) {
    e.preventDefault();
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const payload = {
      title: this.formData.title,
      description: this.formData.description,
      contactName: this.formData.name,
      contactPhone: this.formData.phone,
      name: this.formData.name,
      phone: this.formData.phone,
      type: this.selectedType,
      price: this.formData.price,
      currency: 'BOB',
      location: '',
      imageUrl: this.formData.image || undefined,
    };

    this.http
      .post('http://localhost:3000/api/listings', payload, { withCredentials: true })
      .subscribe({
        next: () => {
          this.successMessage.set('Anuncio publicado exitosamente!');
          this.isLoading.set(false);
          setTimeout(() => this.close(), 1500);
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Error al publicar el anuncio');
          this.isLoading.set(false);
        },
      });
  }

  close() {
    this.clearForm();
    this.closeEvent.emit();
  }
}
