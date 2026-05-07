import { Server, Socket } from 'socket.io';
export declare class AuctionGateway {
    server: Server;
    broadcastBid(data: unknown): void;
    broadcastAlerta(data: unknown): void;
    handleJoinProductChat(data: {
        productId: string;
    }, client: Socket): void;
    handleLeaveProductChat(data: {
        productId: string;
    }, client: Socket): void;
    handleSendMessage(data: {
        productId: string;
        message: string;
        senderId: string;
        senderName: string;
    }, client: Socket): void;
    handleAcknowledgeAlerta(data: {
        alertaId: string;
        userId: string;
    }, client: Socket): void;
}
