import { Model } from 'mongoose';
import { Servicio } from '../../infrastructure/schemas/servicio.schema';
export declare class ServiciosService {
    private servicioModel;
    constructor(servicioModel: Model<Servicio>);
    create(servicioData: any): Promise<import("mongoose").Document<unknown, {}, Servicio> & Servicio & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, Servicio> & Servicio & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, Servicio> & Servicio & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(id: string, updateData: any): Promise<import("mongoose").Document<unknown, {}, Servicio> & Servicio & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    delete(id: string): Promise<import("mongoose").Document<unknown, {}, Servicio> & Servicio & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findByUser(userId: string): Promise<(import("mongoose").Document<unknown, {}, Servicio> & Servicio & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
}
