import { Model } from 'mongoose';
import { Usuario } from '../../infrastructure/schemas/usuario.schema';
export declare class AutenticacionService {
    private usuarioModel;
    constructor(usuarioModel: Model<Usuario>);
    login(email: string, password: string): Promise<{
        accessToken: string;
        usuario: {
            id: any;
            nombre: string;
            email: string;
            rol: "USER" | "ADMIN" | "SUPERADMIN";
            estado: "VERIFICADO";
        };
    }>;
    register(payload: any): Promise<{
        accessToken: string;
        usuario: Usuario & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    me(userId: string): Promise<Usuario & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
