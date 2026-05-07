export interface Product {
  _id: string;
  usuarioId: string;
  titulo: string;
  descripcion: string;
  precio: number;
  estado: 'ACTIVO' | 'VENDIDO' | 'INACTIVO';
  validado: boolean;
  fecha: Date;
}
