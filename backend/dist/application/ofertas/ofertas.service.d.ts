import { Model } from 'mongoose';
import { Oferta } from '../../infrastructure/schemas/oferta.schema';
export declare class OfertasService {
    private ofertaModel;
    constructor(ofertaModel: Model<Oferta>);
    listar(): Promise<(import("mongoose").Document<unknown, {}, Oferta> & Oferta & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    crear(payload: any): Promise<import("mongoose").Document<unknown, {}, Oferta> & Oferta & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
