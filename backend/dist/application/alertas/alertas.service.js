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
exports.AlertasService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const alerta_schema_1 = require("../../infrastructure/schemas/alerta.schema");
const auction_gateway_1 = require("../../infrastructure/websocket/auction.gateway");
let AlertasService = class AlertasService {
    constructor(alertaModel, auctionGateway) {
        this.alertaModel = alertaModel;
        this.auctionGateway = auctionGateway;
    }
    async listar() {
        const alertas = await this.alertaModel.find().sort({ createdAt: -1 }).limit(50).lean().exec();
        return alertas;
    }
    async crear(payload) {
        const nuevaAlerta = new this.alertaModel({
            titulo: payload.titulo,
            mensaje: payload.mensaje,
            tipo: payload.tipo || 'INFO',
            urgency: payload.urgency || 'MEDIA',
            activa: true,
            creadorId: payload.creadorId,
            creadorNombre: payload.creadorNombre,
            leidaPor: [],
        });
        const saved = await nuevaAlerta.save();
        this.auctionGateway.broadcastAlerta({
            _id: saved._id,
            titulo: saved.titulo,
            mensaje: saved.mensaje,
            tipo: saved.tipo,
            urgency: saved.urgency,
            createdAt: new Date().toISOString(),
            creadorNombre: payload.creadorNombre || 'Admin',
            creadorId: payload.creadorId,
        });
        return saved;
    }
    async crearAlertaAutomatico(titulo, mensaje, tipo, urgency, creadorId, creadorNombre) {
        return this.crear({
            titulo,
            mensaje,
            tipo,
            urgency,
            creadorId,
            creadorNombre,
        });
    }
    async marcarLeida(id, userId) {
        return this.alertaModel.findByIdAndUpdate(id, { $addToSet: { leidaPor: userId } }, { new: true }).exec();
    }
};
exports.AlertasService = AlertasService;
exports.AlertasService = AlertasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(alerta_schema_1.Alerta.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        auction_gateway_1.AuctionGateway])
], AlertasService);
//# sourceMappingURL=alertas.service.js.map