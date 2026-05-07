import { PagosService } from './pagos.service';
export declare class PagosController {
    private readonly pagosService;
    constructor(pagosService: PagosService);
    listar(request: any): Promise<(import("mongoose").FlattenMaps<import("../../infrastructure/schemas/pago.schema").Pago> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    listarTodos(): Promise<(import("mongoose").FlattenMaps<import("../../infrastructure/schemas/pago.schema").Pago> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    crear(request: any, payload: any): Promise<import("mongoose").Document<unknown, {}, import("../../infrastructure/schemas/pago.schema").Pago> & import("../../infrastructure/schemas/pago.schema").Pago & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    confirmar(id: string, body: {
        estado: string;
        notas?: string;
    }): Promise<import("mongoose").FlattenMaps<import("../../infrastructure/schemas/pago.schema").Pago> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
