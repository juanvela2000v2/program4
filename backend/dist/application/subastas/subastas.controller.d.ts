import { SubastasService } from './subastas.service';
export declare class SubastasController {
    private readonly subastasService;
    constructor(subastasService: SubastasService);
    listar(): Promise<(import("mongoose").FlattenMaps<import("../../infrastructure/schemas/subasta.schema").Subasta> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    listarActivas(): Promise<(import("mongoose").FlattenMaps<import("../../infrastructure/schemas/subasta.schema").Subasta> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    findById(id: string): Promise<import("mongoose").FlattenMaps<import("../../infrastructure/schemas/subasta.schema").Subasta> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    crear(request: any, payload: any): Promise<import("mongoose").Document<unknown, {}, import("../../infrastructure/schemas/subasta.schema").Subasta> & import("../../infrastructure/schemas/subasta.schema").Subasta & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    iniciar(id: string): Promise<import("mongoose").FlattenMaps<import("../../infrastructure/schemas/subasta.schema").Subasta> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    pujar(id: string, request: any, body: {
        monto: number;
    }): Promise<import("mongoose").FlattenMaps<import("../../infrastructure/schemas/subasta.schema").Subasta> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
