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
exports.SubastasController = void 0;
const common_1 = require("@nestjs/common");
const subastas_service_1 = require("./subastas.service");
const auth_guard_1 = require("../../infrastructure/guards/auth.guard");
let SubastasController = class SubastasController {
    constructor(subastasService) {
        this.subastasService = subastasService;
    }
    listar() {
        return this.subastasService.listar();
    }
    listarActivas() {
        return this.subastasService.listarActivas();
    }
    findById(id) {
        return this.subastasService.findById(id);
    }
    crear(request, payload) {
        return this.subastasService.crear({
            ...payload,
            creadorId: request.user.sub,
            creadorNombre: request.user.nombre,
        });
    }
    iniciar(id) {
        return this.subastasService.iniciarSubasta(id);
    }
    pujar(id, request, body) {
        return this.subastasService.pujar(id, request.user.sub, request.user.nombre, body.monto);
    }
};
exports.SubastasController = SubastasController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SubastasController.prototype, "listar", null);
__decorate([
    (0, common_1.Get)('activas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SubastasController.prototype, "listarActivas", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubastasController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SubastasController.prototype, "crear", null);
__decorate([
    (0, common_1.Post)(':id/iniciar'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubastasController.prototype, "iniciar", null);
__decorate([
    (0, common_1.Post)(':id/pujar'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], SubastasController.prototype, "pujar", null);
exports.SubastasController = SubastasController = __decorate([
    (0, common_1.Controller)('subastas'),
    __metadata("design:paramtypes", [subastas_service_1.SubastasService])
], SubastasController);
//# sourceMappingURL=subastas.controller.js.map