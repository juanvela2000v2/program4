import { UsuariosService } from './usuarios.service';
export declare class UsuariosController {
    private readonly usuariosService;
    constructor(usuariosService: UsuariosService);
    listar(): Promise<(import("mongoose").Document<unknown, {}, import("../../infrastructure/schemas/usuario.schema").Usuario> & import("../../infrastructure/schemas/usuario.schema").Usuario & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    crear(payload: any): Promise<import("mongoose").Document<unknown, {}, import("../../infrastructure/schemas/usuario.schema").Usuario> & import("../../infrastructure/schemas/usuario.schema").Usuario & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    actualizar(request: any, id: string, payload: any): Promise<import("mongoose").Document<unknown, {}, import("../../infrastructure/schemas/usuario.schema").Usuario> & import("../../infrastructure/schemas/usuario.schema").Usuario & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    eliminar(id: string): Promise<import("mongoose").Document<unknown, {}, import("../../infrastructure/schemas/usuario.schema").Usuario> & import("../../infrastructure/schemas/usuario.schema").Usuario & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
