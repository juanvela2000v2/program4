import { AutenticacionService } from './autenticacion.service';
export declare class AutenticacionController {
    private readonly autenticacionService;
    constructor(autenticacionService: AutenticacionService);
    login(body: any): Promise<{
        accessToken: string;
        usuario: {
            id: any;
            nombre: string;
            email: string;
            rol: "USER" | "ADMIN" | "SUPERADMIN";
            estado: "VERIFICADO";
        };
    }>;
    register(body: any): Promise<{
        accessToken: string;
        usuario: import("../../infrastructure/schemas/usuario.schema").Usuario & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    me(request: any): Promise<import("../../infrastructure/schemas/usuario.schema").Usuario & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    logout(): {
        success: boolean;
    };
}
