import { AlertasService } from './alertas.service';
export declare class AlertasController {
    private readonly alertasService;
    constructor(alertasService: AlertasService);
    listar(): Promise<(import("mongoose").FlattenMaps<import("../../infrastructure/schemas/alerta.schema").Alerta> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    crear(payload: any): Promise<import("mongoose").Document<unknown, {}, import("../../infrastructure/schemas/alerta.schema").Alerta> & import("../../infrastructure/schemas/alerta.schema").Alerta & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
