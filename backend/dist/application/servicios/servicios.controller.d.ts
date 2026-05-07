import { ServiciosService } from './servicios.service';
export declare class ServiciosController {
    private readonly serviciosService;
    constructor(serviciosService: ServiciosService);
    create(body: any, request: any): Promise<import("mongoose").Document<unknown, {}, import("../../infrastructure/schemas/servicio.schema").Servicio> & import("../../infrastructure/schemas/servicio.schema").Servicio & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("../../infrastructure/schemas/servicio.schema").Servicio> & import("../../infrastructure/schemas/servicio.schema").Servicio & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, import("../../infrastructure/schemas/servicio.schema").Servicio> & import("../../infrastructure/schemas/servicio.schema").Servicio & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(id: string, body: any, request: any): Promise<import("mongoose").Document<unknown, {}, import("../../infrastructure/schemas/servicio.schema").Servicio> & import("../../infrastructure/schemas/servicio.schema").Servicio & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    delete(id: string): Promise<import("mongoose").Document<unknown, {}, import("../../infrastructure/schemas/servicio.schema").Servicio> & import("../../infrastructure/schemas/servicio.schema").Servicio & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findByUser(userId: string, request: any): Promise<(import("mongoose").Document<unknown, {}, import("../../infrastructure/schemas/servicio.schema").Servicio> & import("../../infrastructure/schemas/servicio.schema").Servicio & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
}
