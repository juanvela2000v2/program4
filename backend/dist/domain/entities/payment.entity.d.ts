export interface Payment {
    _id: string;
    referenciaId: string;
    usuarioId: string;
    monto: number;
    estado: 'PENDIENTE' | 'VALIDADO';
    fecha: Date;
}
