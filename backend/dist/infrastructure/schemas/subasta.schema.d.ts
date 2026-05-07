import { Document } from 'mongoose';
export declare class Subasta extends Document {
    titulo: string;
    descripcion: string;
    categoria: 'PRODUCTO' | 'ROPA' | 'SERVICIO' | 'OTRO';
    imagen: string;
    creadorId: string;
    creadorNombre: string;
    precioInicial: number;
    precioActual: number;
    incrementoMinimo: number;
    pujadorActualId: string;
    pujadorActualNombre: string;
    fechaFin: Date;
    duracionSegundos: number;
    estado: 'ESPERANDO' | 'ACTIVA' | 'FINALIZADA' | 'CANCELADA';
    historialPujas: string[];
}
export declare const SubastaSchema: import("mongoose").Schema<Subasta, import("mongoose").Model<Subasta, any, any, any, Document<unknown, any, Subasta> & Subasta & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Subasta, Document<unknown, {}, import("mongoose").FlatRecord<Subasta>> & import("mongoose").FlatRecord<Subasta> & {
    _id: import("mongoose").Types.ObjectId;
}>;
export declare class Pujador extends Document {
    subastaId: string;
    usuarioId: string;
    usuarioNombre: string;
    monto: number;
    esGanador: boolean;
}
export declare const PujadorSchema: import("mongoose").Schema<Pujador, import("mongoose").Model<Pujador, any, any, any, Document<unknown, any, Pujador> & Pujador & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Pujador, Document<unknown, {}, import("mongoose").FlatRecord<Pujador>> & import("mongoose").FlatRecord<Pujador> & {
    _id: import("mongoose").Types.ObjectId;
}>;
