import { Document } from 'mongoose';
export declare class Alerta extends Document {
    titulo: string;
    mensaje: string;
    tipo: 'INFO' | 'ADVERTENCIA' | 'URGENTE' | 'EMERGENCIA';
    urgency: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
    activa: boolean;
    creadorId: string;
    creadorNombre: string;
    leidaPor: string[];
}
export declare const AlertaSchema: import("mongoose").Schema<Alerta, import("mongoose").Model<Alerta, any, any, any, Document<unknown, any, Alerta> & Alerta & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Alerta, Document<unknown, {}, import("mongoose").FlatRecord<Alerta>> & import("mongoose").FlatRecord<Alerta> & {
    _id: import("mongoose").Types.ObjectId;
}>;
