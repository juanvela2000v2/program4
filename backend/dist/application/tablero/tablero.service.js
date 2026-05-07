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
exports.TableroService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const usuario_schema_1 = require("../../infrastructure/schemas/usuario.schema");
const producto_schema_1 = require("../../infrastructure/schemas/producto.schema");
const subasta_schema_1 = require("../../infrastructure/schemas/subasta.schema");
const pago_schema_1 = require("../../infrastructure/schemas/pago.schema");
let TableroService = class TableroService {
    constructor(usuarioModel, productoModel, subastaModel, pagoModel) {
        this.usuarioModel = usuarioModel;
        this.productoModel = productoModel;
        this.subastaModel = subastaModel;
        this.pagoModel = pagoModel;
    }
    async obtenerIndicadores() {
        const usuarios = await this.usuarioModel.countDocuments().exec();
        const ventas = await this.productoModel.countDocuments({ estado: 'VENDIDO' }).exec();
        const subastas = await this.subastaModel.countDocuments({ estado: 'ACTIVA' }).exec();
        const ingresos = await this.pagoModel
            .aggregate([
            { $match: { estado: 'VALIDADO' } },
            { $group: { _id: null, total: { $sum: '$monto' } } },
        ])
            .exec();
        return {
            usuarios,
            ventas,
            subastas,
            ingresos: ingresos[0]?.total ?? 0,
        };
    }
};
exports.TableroService = TableroService;
exports.TableroService = TableroService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(usuario_schema_1.Usuario.name)),
    __param(1, (0, mongoose_1.InjectModel)(producto_schema_1.Producto.name)),
    __param(2, (0, mongoose_1.InjectModel)(subasta_schema_1.Subasta.name)),
    __param(3, (0, mongoose_1.InjectModel)(pago_schema_1.Pago.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], TableroService);
//# sourceMappingURL=tablero.service.js.map