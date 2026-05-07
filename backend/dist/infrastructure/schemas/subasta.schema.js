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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PujadorSchema = exports.Pujador = exports.SubastaSchema = exports.Subasta = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Subasta = class Subasta extends mongoose_2.Document {
};
exports.Subasta = Subasta;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Subasta.prototype, "titulo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Subasta.prototype, "descripcion", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['PRODUCTO', 'ROPA', 'SERVICIO', 'OTRO'] }),
    __metadata("design:type", String)
], Subasta.prototype, "categoria", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Subasta.prototype, "imagen", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Subasta.prototype, "creadorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Subasta.prototype, "creadorNombre", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Subasta.prototype, "precioInicial", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Subasta.prototype, "precioActual", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], Subasta.prototype, "incrementoMinimo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Subasta.prototype, "pujadorActualId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Subasta.prototype, "pujadorActualNombre", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Subasta.prototype, "fechaFin", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 30 }),
    __metadata("design:type", Number)
], Subasta.prototype, "duracionSegundos", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'ESPERANDO' }),
    __metadata("design:type", String)
], Subasta.prototype, "estado", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Subasta.prototype, "historialPujas", void 0);
exports.Subasta = Subasta = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Subasta);
exports.SubastaSchema = mongoose_1.SchemaFactory.createForClass(Subasta);
let Pujador = class Pujador extends mongoose_2.Document {
};
exports.Pujador = Pujador;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Pujador.prototype, "subastaId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Pujador.prototype, "usuarioId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Pujador.prototype, "usuarioNombre", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Pujador.prototype, "monto", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: false }),
    __metadata("design:type", Boolean)
], Pujador.prototype, "esGanador", void 0);
exports.Pujador = Pujador = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Pujador);
exports.PujadorSchema = mongoose_1.SchemaFactory.createForClass(Pujador);
//# sourceMappingURL=subasta.schema.js.map