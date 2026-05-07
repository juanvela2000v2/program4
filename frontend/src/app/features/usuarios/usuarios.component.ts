import { Component, OnInit } from '@angular/core';
import { NgIf, NgForOf, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { SessionService } from '../../core/session.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [NgIf, NgForOf, AsyncPipe, FormsModule],
  template: `
    <section>
      <h2>Gestión de Usuarios</h2>

      <div *ngIf="user$ | async as user">
        <div *ngIf="user.rol === 'USER'">
          <h3>Mi Perfil</h3>
          <form (ngSubmit)="updateProfile()" *ngIf="!editing">
            <div class="profile-grid">
              <div><strong>Nombre:</strong> {{ user.nombre }}</div>
              <div><strong>Email:</strong> {{ user.email }}</div>
              <div><strong>Rol:</strong> {{ user.rol }}</div>
              <div><strong>Estado:</strong> {{ user.estado }}</div>
              <div><strong>Fecha nacimiento:</strong> {{ user.fechaNacimiento || 'No registrado' }}</div>
              <div><strong>Teléfono:</strong> {{ user.telefono || 'No registrado' }}</div>
              <div><strong>Ciudad:</strong> {{ user.ciudad || 'No registrado' }}</div>
              <div><strong>País:</strong> {{ user.pais || 'No registrado' }}</div>
              <div><strong>Dirección:</strong> {{ user.direccion || 'No registrado' }}</div>
              <div><strong>Descripción:</strong> {{ user.descripcion || 'No registrado' }}</div>
            </div>
            <button type="button" (click)="editing = true">Editar Perfil</button>
          </form>

          <form (ngSubmit)="updateProfile()" *ngIf="editing">
            <label>
              Avatar URL:
              <input type="text" [(ngModel)]="editForm.avatar" name="avatar" />
            </label>
            <label>
              Fecha de nacimiento:
              <input type="date" [(ngModel)]="editForm.fechaNacimiento" name="fechaNacimiento" />
            </label>
            <label>
              Teléfono:
              <input type="text" [(ngModel)]="editForm.telefono" name="telefono" />
            </label>
            <label>
              Dirección:
              <input type="text" [(ngModel)]="editForm.direccion" name="direccion" />
            </label>
            <label>
              Ciudad:
              <input type="text" [(ngModel)]="editForm.ciudad" name="ciudad" />
            </label>
            <label>
              País:
              <input type="text" [(ngModel)]="editForm.pais" name="pais" />
            </label>
            <label>
              Descripción:
              <textarea [(ngModel)]="editForm.descripcion" name="descripcion"></textarea>
            </label>
            <button type="submit">Guardar Cambios</button>
            <button type="button" (click)="cancelEdit()">Cancelar</button>
          </form>
        </div>

        <div *ngIf="user.rol === 'ADMIN' || user.rol === 'SUPERADMIN'">
          <h3>Gestión de Usuarios</h3>
          <div *ngIf="usuarios.length === 0">Cargando usuarios...</div>
          <div class="usuarios-list" *ngIf="usuarios.length > 0">
            <article class="usuario-card" *ngFor="let usuario of usuarios">
              <div class="usuario-header">
                <img *ngIf="usuario.avatar" [src]="usuario.avatar" alt="avatar" />
                <div>
                  <h4>{{ usuario.nombre }}</h4>
                  <p>{{ usuario.email }}</p>
                </div>
              </div>
              <div class="usuario-info">
                <span>Rol: {{ usuario.rol }}</span>
                <span>Estado: {{ usuario.estado }}</span>
              </div>
              <div class="usuario-actions" *ngIf="canManageUser(usuario)">
                <select [(ngModel)]="usuario.newRol" [disabled]="!canChangeRole(usuario)">
                  <option value="USER">USER</option>
                  <option value="ADMIN" *ngIf="user.rol === 'SUPERADMIN'">ADMIN</option>
                </select>
                <button (click)="updateUserRole(usuario)" [disabled]="usuario.rol === usuario.newRol">Cambiar Rol</button>
                <button (click)="deleteUser(usuario)" class="delete-btn" *ngIf="user.rol === 'SUPERADMIN'">Eliminar</button>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .profile-grid {
        display: grid;
        gap: 8px;
        margin-bottom: 16px;
      }
      label {
        display: block;
        margin-bottom: 12px;
      }
      textarea {
        width: 100%;
        min-height: 80px;
      }
      .usuarios-list {
        display: grid;
        gap: 16px;
      }
      .usuario-card {
        border: 1px solid #ddd;
        padding: 14px;
        border-radius: 8px;
        background: white;
      }
      .usuario-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
      }
      .usuario-header img {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
      }
      .usuario-info {
        display: flex;
        gap: 16px;
        margin-bottom: 12px;
      }
      .usuario-actions {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .delete-btn {
        background: #dc3545;
        color: white;
      }
    `,
  ],
})
export class UsuariosComponent implements OnInit {
  user$ = this.session.currentUser$;
  usuarios: any[] = [];
  editing = false;
  editForm = {
    avatar: '',
    fechaNacimiento: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: '',
    descripcion: '',
  };

  constructor(private api: ApiService, private session: SessionService) {}

  ngOnInit() {
    this.user$.subscribe(user => {
      if (user && (user.rol === 'ADMIN' || user.rol === 'SUPERADMIN')) {
        this.loadUsuarios();
      }
    });
  }

  loadUsuarios() {
    this.api.get<any[]>('usuarios').subscribe({
      next: data => {
        this.usuarios = data.map(u => ({ ...u, newRol: u.rol }));
      },
      error: () => {
        this.usuarios = [];
      },
    });
  }

  updateProfile() {
    const token = this.session.getToken();
    if (!token) return;

    this.api.put('usuarios/' + this.session.currentUser$.value.id, this.editForm, token).subscribe({
      next: updated => {
        this.session.setSession(token, updated);
        this.editing = false;
      },
      error: () => {
        alert('Error al actualizar perfil');
      },
    });
  }

  cancelEdit() {
    this.editing = false;
    this.resetEditForm();
  }

  resetEditForm() {
    const user = this.session.currentUser$.value;
    this.editForm = {
      avatar: user.avatar || '',
      fechaNacimiento: user.fechaNacimiento || '',
      telefono: user.telefono || '',
      direccion: user.direccion || '',
      ciudad: user.ciudad || '',
      pais: user.pais || '',
      descripcion: user.descripcion || '',
    };
  }

  canManageUser(usuario: any): boolean {
    const currentUser = this.session.currentUser$.value;
    if (currentUser.rol === 'SUPERADMIN') return true;
    if (currentUser.rol === 'ADMIN' && usuario.rol === 'USER') return true;
    return false;
  }

  canChangeRole(usuario: any): boolean {
    const currentUser = this.session.currentUser$.value;
    return currentUser.rol === 'SUPERADMIN' && usuario.rol !== 'SUPERADMIN';
  }

  updateUserRole(usuario: any) {
    const token = this.session.getToken();
    if (!token || !this.canChangeRole(usuario)) return;

    this.api.put(`usuarios/${usuario._id}`, { rol: usuario.newRol }, token).subscribe({
      next: () => {
        usuario.rol = usuario.newRol;
        alert('Rol actualizado correctamente');
      },
      error: () => {
        alert('Error al actualizar rol');
      },
    });
  }

  deleteUser(usuario: any) {
    const token = this.session.getToken();
    if (!token || !confirm('¿Estás seguro de eliminar este usuario?')) return;

    this.api.delete(`usuarios/${usuario._id}`, token).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter(u => u._id !== usuario._id);
        alert('Usuario eliminado correctamente');
      },
      error: () => {
        alert('Error al eliminar usuario');
      },
    });
  }
}
