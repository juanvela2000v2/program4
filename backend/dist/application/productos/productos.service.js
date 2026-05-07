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
exports.ProductosService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const producto_schema_1 = require("../../infrastructure/schemas/producto.schema");
const usuario_schema_1 = require("../../infrastructure/schemas/usuario.schema");
let ProductosService = class ProductosService {
    constructor(productoModel, usuarioModel) {
        this.productoModel = productoModel;
        this.usuarioModel = usuarioModel;
    }
    async listar() {
        const productos = await this.productoModel.find().lean().exec();
        const usuarioIds = [...new Set(productos.map(p => p.usuarioId).filter(Boolean))];
        const usuarios = await this.usuarioModel.find({ _id: { $in: usuarioIds } }).select('nombre avatar').lean().exec();
        const usuarioMap = new Map(usuarios.map(u => [u._id.toString(), u]));
        return productos.map(p => ({
            ...p,
            vendedorNombre: usuarioMap.get(p.usuarioId)?.nombre || p.vendedorNombre,
            vendedorAvatar: usuarioMap.get(p.usuarioId)?.avatar || p.vendedorAvatar,
        }));
    }
    crear(payload) {
        const producto = new this.productoModel(payload);
        return producto.save();
    }
    async findById(id) {
        const producto = await this.productoModel.findById(id).exec();
        if (producto && producto.usuarioId) {
            const vendedor = await this.usuarioModel.findById(producto.usuarioId).select('nombre avatar email').exec();
            if (vendedor) {
                return {
                    ...producto.toObject(),
                    vendedor: {
                        _id: vendedor._id,
                        nombre: vendedor.nombre,
                        avatar: vendedor.avatar,
                        email: vendedor.email,
                    },
                };
            }
        }
        return producto;
    }
    actualizar(id, payload) {
        return this.productoModel.findByIdAndUpdate(id, payload, { new: true }).exec();
    }
    eliminar(id) {
        return this.productoModel.findByIdAndDelete(id).exec();
    }
};
exports.ProductosService = ProductosService;
exports.ProductosService = ProductosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(producto_schema_1.Producto.name)),
    __param(1, (0, mongoose_1.InjectModel)(usuario_schema_1.Usuario.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ProductosService);
//# sourceMappingURL=productos.service.js.map