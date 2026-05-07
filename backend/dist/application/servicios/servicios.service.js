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
exports.ServiciosService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const servicio_schema_1 = require("../../infrastructure/schemas/servicio.schema");
let ServiciosService = class ServiciosService {
    constructor(servicioModel) {
        this.servicioModel = servicioModel;
    }
    async create(servicioData) {
        const servicio = new this.servicioModel(servicioData);
        return servicio.save();
    }
    async findAll() {
        return this.servicioModel.find({ estado: 'ACTIVO' }).exec();
    }
    async findById(id) {
        const servicio = await this.servicioModel.findById(id).exec();
        if (!servicio) {
            throw new common_1.NotFoundException('Servicio no encontrado');
        }
        return servicio;
    }
    async update(id, updateData) {
        const servicio = await this.servicioModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
        if (!servicio) {
            throw new common_1.NotFoundException('Servicio no encontrado');
        }
        return servicio;
    }
    async delete(id) {
        const servicio = await this.servicioModel.findByIdAndDelete(id).exec();
        if (!servicio) {
            throw new common_1.NotFoundException('Servicio no encontrado');
        }
        return servicio;
    }
    async findByUser(userId) {
        return this.servicioModel.find({ usuarioId: userId }).exec();
    }
};
exports.ServiciosService = ServiciosService;
exports.ServiciosService = ServiciosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(servicio_schema_1.Servicio.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ServiciosService);
//# sourceMappingURL=servicios.service.js.map