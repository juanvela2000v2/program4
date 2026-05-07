"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagosService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const pago_schema_1 = require("../../infrastructure/schemas/pago.schema");
const auction_gateway_1 = require("../../infrastructure/websocket/auction.gateway");
let PagosService = class PagosService {
    constructor(pagoModel, auctionGateway) {
        this.pagoModel = pagoModel;
        this.auctionGateway = auctionGateway;
    }
    async listar() {
        return this.pagoModel.find().sort({ createdAt: -1 }).lean().exec();
    }
    async misPagos(usuarioId) {
        return this.pagoModel.find({
            $or: [{ usuarioId }, { vendedorId: usuarioId }]
        }).sort({ createdAt: -1 }).lean().exec();
    }
    async crear(payload) {
        const pago = new this.pagoModel({
            ...payload,
            estado: 'PENDIENTE',
        });
        const saved = await pago.save();
        this.auctionGateway.broadcastAlerta({
            type: 'PAGO_PENDIENTE',
            pagoId: saved._id,
            titulo: 'Nuevo pago pendiente',
            mensaje: `Pago de $${saved.monto} para ${saved.referenciaTitulo}`,
            monto: saved.monto,
            metodoPago: saved.metodoPago,
            buyerId: saved.usuarioId,
            buyerNombre: saved.usuarioNombre,
        });
        return saved;
    }
    async crearPagoAutomatico(usuarioId, usuarioNombre, vendedorId, vendedorNombre, monto, referenciaTipo, referenciaTitulo) {
        return this.crear({
            referenciaId: '',
            referenciaTipo,
            referenciaTitulo,
            usuarioId,
            usuarioNombre,
            vendedorId,
            vendedorNombre,
            monto,
            metodoPago: 'EFECTIVO',
        });
    }
    async actualizarEstado(pagoId, estado, notas) {
        const updated = await this.pagoModel.findByIdAndUpdate(pagoId, { estado, notas }, { new: true }).lean();
        return updated;
    }
};
exports.PagosService = PagosService;
exports.PagosService = PagosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(pago_schema_1.Pago.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        auction_gateway_1.AuctionGateway])
], PagosService);
//# sourceMappingURL=pagos.service.js.map