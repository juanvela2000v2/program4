import { Document } from 'mongoose';
export declare class Pago extends Document {
    referenciaId: string;
    referenciaTipo: 'SUBASTA' | 'PRODUCTO' | 'SERVICIO';
    referenciaTitulo: string;
    usuarioId: string;
    usuarioNombre: string;
    vendedorId: string;
    vendedorNombre: string;
    monto: number;
    estado: 'PENDIENTE' | 'PAGADO' | 'VALIDADO' | 'RECHAZADO';
    metodoPago: 'EFECTIVO' | 'QR';
    comprobante: string;
    notas: string;
}
export declare const PagoSchema: import("mongoose").Schema<Pago, import("mongoose").Model<Pago, any, any, any, Document<unknown, any, Pago> & Pago & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Pago, Document<unknown, {}, import("mongoose").FlatRecord<Pago>> & import("mongoose").FlatRecord<Pago> & {
    _id: import("mongoose").Types.ObjectId;
}>;
