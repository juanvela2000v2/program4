import { Model } from 'mongoose';
import { Subasta, Pujador } from '../../infrastructure/schemas/subasta.schema';
import { AuctionGateway } from '../../infrastructure/websocket/auction.gateway';
import { AlertasService } from '../alertas/alertas.service';
import { PagosService } from '../pagos/pagos.service';
export declare class SubastasService {
    private auctionModel;
    private bidderModel;
    private auctionGateway;
    private alertasService;
    private pagosService;
    constructor(auctionModel: Model<Subasta>, bidderModel: Model<Pujador>, auctionGateway: AuctionGateway, alertasService: AlertasService, pagosService: PagosService);
    listar(): Promise<(import("mongoose").FlattenMaps<Subasta> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    listarActivas(): Promise<(import("mongoose").FlattenMaps<Subasta> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    crear(payload: any): Promise<import("mongoose").Document<unknown, {}, Subasta> & Subasta & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findById(id: string): Promise<import("mongoose").FlattenMaps<Subasta> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    iniciarSubasta(id: string): Promise<import("mongoose").FlattenMaps<Subasta> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    pujar(subastaId: string, usuarioId: string, usuarioNombre: string, monto: number): Promise<import("mongoose").FlattenMaps<Subasta> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    finalizarSubasta(subastaId: string): Promise<{
        estado: string;
        precioFinal: number;
        winnerId: string;
        winnerName: string;
    }>;
}
