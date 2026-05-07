import { Model } from 'mongoose';
import { Usuario } from '../../infrastructure/schemas/usuario.schema';
export declare class UsuariosService {
    private usuarioModel;
    constructor(usuarioModel: Model<Usuario>);
    listar(): Promise<(import("mongoose").Document<unknown, {}, Usuario> & Usuario & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    crear(payload: any): Promise<import("mongoose").Document<unknown, {}, Usuario> & Usuario & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    actualizar(id: string, payload: any): Promise<import("mongoose").Document<unknown, {}, Usuario> & Usuario & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    eliminar(id: string): Promise<import("mongoose").Document<unknown, {}, Usuario> & Usuario & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, Usuario> & Usuario & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
