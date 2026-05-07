import { OfertasService } from './ofertas.service';
export declare class OfertasController {
    private readonly ofertasService;
    constructor(ofertasService: OfertasService);
    listar(): Promise<(import("mongoose").Document<unknown, {}, import("../../infrastructure/schemas/oferta.schema").Oferta> & import("../../infrastructure/schemas/oferta.schema").Oferta & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    crear(payload: any): Promise<import("mongoose").Document<unknown, {}, import("../../infrastructure/schemas/oferta.schema").Oferta> & import("../../infrastructure/schemas/oferta.schema").Oferta & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
