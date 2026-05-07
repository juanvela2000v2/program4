import { Model } from 'mongoose';
import { Chat, Mensaje } from '../../infrastructure/schemas/chat.schema';
export declare class ChatService {
    private chatModel;
    private mensajeModel;
    constructor(chatModel: Model<Chat>, mensajeModel: Model<Mensaje>);
    buscarOcrear(productoId: string, vendedorId: string, vendedorNombre: string, compradorId: string, compradorNombre: string, productoTitulo: string): Promise<import("mongoose").Document<unknown, {}, Chat> & Chat & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findById(chatId: string): Promise<import("mongoose").Document<unknown, {}, Chat> & Chat & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    misChats(usuarioId: string): Promise<(import("mongoose").Document<unknown, {}, Chat> & Chat & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    addMessage(chatId: string, emisorId: string, emisorNombre: string, contenido: string): Promise<import("mongoose").Document<unknown, {}, Mensaje> & Mensaje & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getMessages(chatId: string): Promise<(import("mongoose").FlattenMaps<Mensaje> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    marcarLeido(chatId: string, usuarioId: string): Promise<import("mongoose").UpdateWriteOpResult>;
}
