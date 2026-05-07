export interface Auction {
  _id: string;
  productoId: string;
  precioInicial: number;
  precioActual: number;
  fechaInicio: Date;
  fechaFin: Date;
  estado: 'ACTIVA' | 'FINALIZADA';
}
