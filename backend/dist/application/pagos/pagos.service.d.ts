import { Model } from 'mongoose';
import { Pago } from '../../infrastructure/schemas/pago.schema';
import { AuctionGateway } from '../../infrastructure/websocket/auction.gateway';
export declare class PagosService {
    private pagoModel;
    private auctionGateway;
    constructor(pagoModel: Model<Pago>, auctionGateway: AuctionGateway);
    listar(): Promise<(import("mongoose").FlattenMaps<Pago> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    misPagos(usuarioId: string): Promise<(import("mongoose").FlattenMaps<Pago> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    crear(payload: any): Promise<import("mongoose").Document<unknown, {}, Pago> & Pago & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    crearPagoAutomatico(usuarioId: string, usuarioNombre: string, vendedorId: string, vendedorNombre: string, monto: number, referenciaTipo: string, referenciaTitulo: string): Promise<import("mongoose").Document<unknown, {}, Pago> & Pago & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    actualizarEstado(pagoId: string, estado: string, notas?: string): Promise<import("mongoose").FlattenMaps<Pago> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
