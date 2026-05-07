import { Model } from 'mongoose';
import { Alerta } from '../../infrastructure/schemas/alerta.schema';
import { AuctionGateway } from '../../infrastructure/websocket/auction.gateway';
export declare class AlertasService {
    private alertaModel;
    private auctionGateway;
    constructor(alertaModel: Model<Alerta>, auctionGateway: AuctionGateway);
    listar(): Promise<(import("mongoose").FlattenMaps<Alerta> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    crear(payload: any): Promise<import("mongoose").Document<unknown, {}, Alerta> & Alerta & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    crearAlertaAutomatico(titulo: string, mensaje: string, tipo: string, urgency: string, creadorId: string, creadorNombre: string): Promise<import("mongoose").Document<unknown, {}, Alerta> & Alerta & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    marcarLeida(id: string, userId: string): Promise<import("mongoose").Document<unknown, {}, Alerta> & Alerta & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
