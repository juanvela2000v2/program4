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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const chat_schema_1 = require("../../infrastructure/schemas/chat.schema");
let ChatService = class ChatService {
    constructor(chatModel, mensajeModel) {
        this.chatModel = chatModel;
        this.mensajeModel = mensajeModel;
    }
    async buscarOcrear(productoId, vendedorId, vendedorNombre, compradorId, compradorNombre, productoTitulo) {
        let chat = await this.chatModel.findOne({
            productoId,
            compradorId,
            estado: { $ne: 'CERRADO' },
        }).exec();
        if (!chat) {
            chat = new this.chatModel({
                productoId,
                productoTitulo,
                vendedorId,
                vendedorNombre,
                compradorId,
                compradorNombre,
                estado: 'ACTIVO',
            });
            await chat.save();
        }
        return chat;
    }
    async findById(chatId) {
        return this.chatModel.findById(chatId).exec();
    }
    async misChats(usuarioId) {
        return this.chatModel.find({
            $or: [{ vendedorId: usuarioId }, { compradorId: usuarioId }],
            estado: { $ne: 'CERRADO' },
        }).sort({ updatedAt: -1 }).exec();
    }
    async addMessage(chatId, emisorId, emisorNombre, contenido) {
        const mensaje = new this.mensajeModel({
            chatId,
            emisorId,
            emisorNombre,
            contenido,
            leido: false,
        });
        await mensaje.save();
        await this.chatModel.findByIdAndUpdate(chatId, { updatedAt: new Date() });
        return mensaje;
    }
    async getMessages(chatId) {
        return this.mensajeModel.find({ chatId }).sort({ createdAt: 1 }).lean().exec();
    }
    async marcarLeido(chatId, usuarioId) {
        return this.mensajeModel.updateMany({ chatId, emisorId: { $ne: usuarioId }, leido: false }, { $set: { leido: true } }).exec();
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chat_schema_1.Chat.name)),
    __param(1, (0, mongoose_1.InjectModel)(chat_schema_1.Mensaje.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ChatService);
//# sourceMappingURL=chat.service.js.map