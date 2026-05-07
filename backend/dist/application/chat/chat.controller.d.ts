import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    iniciar(request: any, body: any): Promise<import("mongoose").Document<unknown, {}, import("../../infrastructure/schemas/chat.schema").Chat> & import("../../infrastructure/schemas/chat.schema").Chat & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    misChats(request: any): Promise<(import("mongoose").Document<unknown, {}, import("../../infrastructure/schemas/chat.schema").Chat> & import("../../infrastructure/schemas/chat.schema").Chat & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getChat(id: string): Promise<import("mongoose").Document<unknown, {}, import("../../infrastructure/schemas/chat.schema").Chat> & import("../../infrastructure/schemas/chat.schema").Chat & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getMensajes(id: string, request: any): Promise<(import("mongoose").FlattenMaps<import("../../infrastructure/schemas/chat.schema").Mensaje> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    addMensaje(id: string, request: any, body: any): Promise<import("mongoose").Document<unknown, {}, import("../../infrastructure/schemas/chat.schema").Mensaje> & import("../../infrastructure/schemas/chat.schema").Mensaje & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
