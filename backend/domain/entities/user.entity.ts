export interface User {
  _id: string;
  nombre: string;
  email: string;
  password: string;
  carnetImagen: string;
  estado: 'PENDIENTE' | 'VERIFICADO' | 'RECHAZADO';
  rol: 'USER' | 'ADMIN' | 'SUPERADMIN';
  createdAt: Date;
}
