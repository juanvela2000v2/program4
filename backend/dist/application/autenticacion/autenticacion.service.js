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
exports.AutenticacionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const usuario_schema_1 = require("../../infrastructure/schemas/usuario.schema");
const jsonwebtoken_1 = require("jsonwebtoken");
const bcryptjs_1 = require("bcryptjs");
let AutenticacionService = class AutenticacionService {
    constructor(usuarioModel) {
        this.usuarioModel = usuarioModel;
    }
    async login(email, password) {
        const usuario = await this.usuarioModel.findOne({ email }).exec();
        if (!usuario || !(0, bcryptjs_1.compareSync)(password, usuario.password)) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        if (usuario.estado !== 'VERIFICADO') {
            throw new common_1.UnauthorizedException('Usuario no verificado');
        }
        const payload = {
            sub: usuario._id.toString(),
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol,
            estado: usuario.estado,
            avatar: usuario.avatar,
        };
        const token = (0, jsonwebtoken_1.sign)(payload, process.env.JWT_SECRET || 'CAMBALACHE_SECRET', {
            expiresIn: '12h',
        });
        return {
            accessToken: token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
                estado: usuario.estado,
            },
        };
    }
    async register(payload) {
        const existing = await this.usuarioModel.findOne({ email: payload.email }).exec();
        if (existing) {
            throw new common_1.ConflictException('El email ya está registrado');
        }
        const registro = new this.usuarioModel({
            nombre: payload.nombre,
            email: payload.email,
            password: (0, bcryptjs_1.hashSync)(payload.password, 10),
            avatar: payload.avatar || 'https://i.pravatar.cc/150?img=21',
            carnetImagen: payload.carnetImagen || 'sin-imagen',
            fechaNacimiento: payload.fechaNacimiento,
            telefono: payload.telefono,
            direccion: payload.direccion,
            ciudad: payload.ciudad,
            pais: payload.pais,
            descripcion: payload.descripcion,
            estado: 'VERIFICADO',
            rol: 'USER',
            createdAt: new Date(),
        });
        const saved = await registro.save();
        const usuario = saved.toObject();
        delete usuario.password;
        const payloadToken = {
            sub: usuario._id.toString(),
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol,
            estado: usuario.estado,
            avatar: usuario.avatar,
        };
        const token = (0, jsonwebtoken_1.sign)(payloadToken, process.env.JWT_SECRET || 'CAMBALACHE_SECRET', {
            expiresIn: '12h',
        });
        return {
            accessToken: token,
            usuario,
        };
    }
    async me(userId) {
        const usuario = await this.usuarioModel.findById(userId).exec();
        if (!usuario) {
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        }
        const userObj = usuario.toObject();
        delete userObj.password;
        return userObj;
    }
};
exports.AutenticacionService = AutenticacionService;
exports.AutenticacionService = AutenticacionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(usuario_schema_1.Usuario.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AutenticacionService);
//# sourceMappingURL=autenticacion.service.js.map