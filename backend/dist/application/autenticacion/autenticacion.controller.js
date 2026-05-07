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
exports.AutenticacionController = void 0;
const common_1 = require("@nestjs/common");
const autenticacion_service_1 = require("./autenticacion.service");
const auth_guard_1 = require("../../infrastructure/guards/auth.guard");
let AutenticacionController = class AutenticacionController {
    constructor(autenticacionService) {
        this.autenticacionService = autenticacionService;
    }
    login(body) {
        return this.autenticacionService.login(body.email, body.password);
    }
    register(body) {
        return this.autenticacionService.register(body);
    }
    me(request) {
        return this.autenticacionService.me(request.user.sub);
    }
    logout() {
        return { success: true };
    }
};
exports.AutenticacionController = AutenticacionController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AutenticacionController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AutenticacionController.prototype, "register", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AutenticacionController.prototype, "me", null);
__decorate([
    (0, common_1.Post)('logout'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AutenticacionController.prototype, "logout", null);
exports.AutenticacionController = AutenticacionController = __decorate([
    (0, common_1.Controller)('autenticacion'),
    __metadata("design:paramtypes", [autenticacion_service_1.AutenticacionService])
], AutenticacionController);
//# sourceMappingURL=autenticacion.controller.js.map