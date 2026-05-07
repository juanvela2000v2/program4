import { Document } from 'mongoose';
export declare class Producto extends Document {
    usuarioId: string;
    vendedorNombre: string;
    vendedorAvatar: string;
    titulo: string;
    descripcion: string;
    precio: number;
    estado: 'ACTIVO' | 'VENDIDO' | 'INACTIVO';
    validado: boolean;
    fecha: Date;
}
export declare const ProductoSchema: import("mongoose").Schema<Producto, import("mongoose").Model<Producto, any, any, any, Document<unknown, any, Producto> & Producto & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Producto, Document<unknown, {}, import("mongoose").FlatRecord<Producto>> & import("mongoose").FlatRecord<Producto> & {
    _id: import("mongoose").Types.ObjectId;
}>;
