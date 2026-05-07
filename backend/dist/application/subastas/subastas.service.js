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
exports.SubastasService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const subasta_schema_1 = require("../../infrastructure/schemas/subasta.schema");
const auction_gateway_1 = require("../../infrastructure/websocket/auction.gateway");
const alertas_service_1 = require("../alertas/alertas.service");
const pagos_service_1 = require("../pagos/pagos.service");
let SubastasService = class SubastasService {
    constructor(auctionModel, bidderModel, auctionGateway, alertasService, pagosService) {
        this.auctionModel = auctionModel;
        this.bidderModel = bidderModel;
        this.auctionGateway = auctionGateway;
        this.alertasService = alertasService;
        this.pagosService = pagosService;
    }
    async listar() {
        return this.auctionModel.find().sort({ createdAt: -1 }).limit(50).lean().exec();
    }
    async listarActivas() {
        return this.auctionModel.find({ estado: 'ACTIVA' }).sort({ fechaFin: 1 }).lean().exec();
    }
    async crear(payload) {
        const auction = new this.auctionModel({
            titulo: payload.titulo,
            descripcion: payload.descripcion,
            categoria: payload.categoria,
            imagen: payload.imagen,
            creadorId: payload.creadorId,
            creadorNombre: payload.creadorNombre,
            precioInicial: payload.precioInicial,
            precioActual: payload.precioInicial,
            incrementoMinimo: payload.incrementoMinimo || 1,
            pujadorActualId: '',
            pujadorActualNombre: '',
            fechaFin: new Date(Date.now() + (payload.duracionSegundos || 30) * 1000),
            duracionSegundos: payload.duracionSegundos || 30,
            estado: 'ESPERANDO',
            historialPujas: [],
        });
        return auction.save();
    }
    async findById(id) {
        return this.auctionModel.findById(id).lean().exec();
    }
    async iniciarSubasta(id) {
        const auction = await this.auctionModel.findById(id).exec();
        if (!auction)
            throw new Error('Subasta no encontrada');
        const duracion = auction.duracionSegundos || 30;
        const fechaFin = new Date(Date.now() + duracion * 1000);
        const updated = await this.auctionModel.findByIdAndUpdate(id, { estado: 'ACTIVA', fechaFin, duracionSegundos: duracion }, { new: true }).lean();
        this.auctionGateway.broadcastBid({ type: 'SUBASTA_INICIADA', auction: updated });
        setTimeout(() => this.finalizarSubasta(id), duracion * 1000);
        return updated;
    }
    async pujar(subastaId, usuarioId, usuarioNombre, monto) {
        const auction = await this.auctionModel.findById(subastaId).exec();
        if (!auction || auction.estado !== 'ACTIVA') {
            throw new Error('Subasta no disponible');
        }
        if (monto <= auction.precioActual) {
            throw new Error('El monto debe ser mayor al precio actual');
        }
        const updated = await this.auctionModel.findByIdAndUpdate(subastaId, {
            precioActual: monto,
            pujadorActualId: usuarioId,
            pujadorActualNombre: usuarioNombre,
            $push: { historialPujas: `${usuarioNombre}: $${monto}` },
        }, { new: true }).lean();
        this.auctionGateway.broadcastBid({
            type: 'NUEVA_PUJA',
            precioActual: monto,
            pujadorNombre: usuarioNombre,
            subastaId,
        });
        const remaining = new Date(auction.fechaFin).getTime() - Date.now();
        if (remaining < 10000) {
            await this.auctionModel.findByIdAndUpdate(subastaId, {
                fechaFin: new Date(Date.now() + 10000),
            });
        }
        return updated;
    }
    async finalizarSubasta(subastaId) {
        const auction = await this.auctionModel.findById(subastaId).exec();
        if (!auction || auction.estado === 'FINALIZADA')
            return;
        await this.auctionModel.findByIdAndUpdate(subastaId, { estado: 'FINALIZADA' }).exec();
        const hasWinner = auction.pujadorActualId && auction.pujadorActualNombre;
        if (hasWinner) {
            await this.alertasService.crearAlertaAutomatico('Subasta Ganada: ' + auction.titulo, 'Ganaste la subasta de ' + auction.titulo + ' por $' + auction.precioActual + '. Contacta al vendedor.', 'URGENTE', 'ALTA', auction.pujadorActualId, auction.pujadorActualNombre);
            await this.alertasService.crearAlertaAutomatico('Tu articulo se vendio: ' + auction.titulo, 'Tu artikel ' + auction.titulo + ' se vendio por $' + auction.precioActual + ' a ' + auction.pujadorActualNombre + '.', 'INFO', 'MEDIA', auction.creadorId, auction.creadorNombre);
            await this.pagosService.crearPagoAutomatico(auction.pujadorActualId, auction.pujadorActualNombre, auction.creadorId, auction.creadorNombre, auction.precioActual, 'SUBASTA', auction.titulo);
        }
        this.auctionGateway.broadcastBid({
            type: 'SUBASTA_FINALIZADA',
            auctionId: subastaId,
            precioFinal: auction.precioActual,
            winnerId: auction.pujadorActualId,
            winnerName: auction.pujadorActualNombre,
        });
        return {
            estado: 'FINALIZADA',
            precioFinal: auction.precioActual,
            winnerId: auction.pujadorActualId,
            winnerName: auction.pujadorActualNombre,
        };
    }
};
exports.SubastasService = SubastasService;
exports.SubastasService = SubastasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(subasta_schema_1.Subasta.name)),
    __param(1, (0, mongoose_1.InjectModel)(subasta_schema_1.Pujador.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        auction_gateway_1.AuctionGateway,
        alertas_service_1.AlertasService,
        pagos_service_1.PagosService])
], SubastasService);
//# sourceMappingURL=subastas.service.js.map