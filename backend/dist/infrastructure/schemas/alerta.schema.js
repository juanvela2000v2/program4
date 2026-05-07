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
exports.AlertaSchema = exports.Alerta = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Alerta = class Alerta extends mongoose_2.Document {
};
exports.Alerta = Alerta;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Alerta.prototype, "titulo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Alerta.prototype, "mensaje", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'INFO' }),
    __metadata("design:type", String)
], Alerta.prototype, "tipo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'MEDIA' }),
    __metadata("design:type", String)
], Alerta.prototype, "urgency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: true }),
    __metadata("design:type", Boolean)
], Alerta.prototype, "activa", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Alerta.prototype, "creadorId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Alerta.prototype, "creadorNombre", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Alerta.prototype, "leidaPor", void 0);
exports.Alerta = Alerta = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Alerta);
exports.AlertaSchema = mongoose_1.SchemaFactory.createForClass(Alerta);
//# sourceMappingURL=alerta.schema.js.map