import { Document } from 'mongoose';
export declare class Oferta extends Document {
    subastaId: string;
    usuarioId: string;
    monto: number;
    fecha: Date;
}
export declare const OfertaSchema: import("mongoose").Schema<Oferta, import("mongoose").Model<Oferta, any, any, any, Document<unknown, any, Oferta> & Oferta & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Oferta, Document<unknown, {}, import("mongoose").FlatRecord<Oferta>> & import("mongoose").FlatRecord<Oferta> & {
    _id: import("mongoose").Types.ObjectId;
}>;
