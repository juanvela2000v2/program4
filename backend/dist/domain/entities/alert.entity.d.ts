export interface Alert {
    _id: string;
    titulo: string;
    descripcion: string;
    tipo: 'PELIGRO' | 'INFORMATIVO' | 'VENTA';
    activa: boolean;
    fecha: Date;
}
