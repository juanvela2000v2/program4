import { Document } from 'mongoose';
export declare class Servicio extends Document {
    usuarioId: string;
    proveedorNombre: string;
    proveedorAvatar: string;
    titulo: string;
    descripcion: string;
    tipo: 'OFRECER' | 'BUSCAR';
    categoria: string;
    precio?: number;
    estado: 'ACTIVO' | 'COMPLETADO' | 'INACTIVO';
    validado: boolean;
    fecha: Date;
}
export declare const ServicioSchema: import("mongoose").Schema<Servicio, import("mongoose").Model<Servicio, any, any, any, Document<unknown, any, Servicio> & Servicio & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Servicio, Document<unknown, {}, import("mongoose").FlatRecord<Servicio>> & import("mongoose").FlatRecord<Servicio> & {
    _id: import("mongoose").Types.ObjectId;
}>;
