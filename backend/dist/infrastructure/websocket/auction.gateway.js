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
exports.AuctionGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let AuctionGateway = class AuctionGateway {
    broadcastBid(data) {
        this.server.emit('auction_bid', data);
    }
    broadcastAlerta(data) {
        this.server.emit('new_alerta', data);
    }
    handleJoinProductChat(data, client) {
        client.join(`product_${data.productId}`);
    }
    handleLeaveProductChat(data, client) {
        client.leave(`product_${data.productId}`);
    }
    handleSendMessage(data, client) {
        this.server.to(`product_${data.productId}`).emit('new_message', {
            message: data.message,
            senderId: data.senderId,
            senderName: data.senderName,
            timestamp: new Date(),
        });
    }
    handleAcknowledgeAlerta(data, client) {
        client.emit('alerta_acknowledged', { alertaId: data.alertaId, userId: data.userId });
    }
};
exports.AuctionGateway = AuctionGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], AuctionGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_product_chat'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], AuctionGateway.prototype, "handleJoinProductChat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave_product_chat'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], AuctionGateway.prototype, "handleLeaveProductChat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], AuctionGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('acknowledge_alerta'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], AuctionGateway.prototype, "handleAcknowledgeAlerta", null);
exports.AuctionGateway = AuctionGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/auctions',
        cors: {
            origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
            credentials: true,
        },
    })
], AuctionGateway);
//# sourceMappingURL=auction.gateway.js.map