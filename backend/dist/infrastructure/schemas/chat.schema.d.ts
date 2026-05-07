import { Document } from 'mongoose';
export declare class Chat extends Document {
    productoId: string;
    productoTitulo: string;
    vendedorId: string;
    vendedorNombre: string;
    compradorId: string;
    compradorNombre: string;
    estado: 'ACTIVO' | 'BLOQUEADO' | 'CERRADO';
}
export declare const ChatSchema: import("mongoose").Schema<Chat, import("mongoose").Model<Chat, any, any, any, Document<unknown, any, Chat> & Chat & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Chat, Document<unknown, {}, import("mongoose").FlatRecord<Chat>> & import("mongoose").FlatRecord<Chat> & {
    _id: import("mongoose").Types.ObjectId;
}>;
export declare class Mensaje extends Document {
    chatId: string;
    emisorId: string;
    emisorNombre: string;
    contenido: string;
    leido: boolean;
}
export declare const MensajeSchema: import("mongoose").Schema<Mensaje, import("mongoose").Model<Mensaje, any, any, any, Document<unknown, any, Mensaje> & Mensaje & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Mensaje, Document<unknown, {}, import("mongoose").FlatRecord<Mensaje>> & import("mongoose").FlatRecord<Mensaje> & {
    _id: import("mongoose").Types.ObjectId;
}>;
