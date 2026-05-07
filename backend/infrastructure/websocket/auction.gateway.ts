import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/auctions',
  cors: {
    origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
    credentials: true,
  },
})
export class AuctionGateway {
  @WebSocketServer()
  server: Server;

  broadcastBid(data: unknown) {
    this.server.emit('auction_bid', data);
  }

  broadcastAlerta(data: unknown) {
    this.server.emit('new_alerta', data);
  }

  @SubscribeMessage('join_product_chat')
  handleJoinProductChat(@MessageBody() data: { productId: string }, @ConnectedSocket() client: Socket) {
    client.join(`product_${data.productId}`);
  }

  @SubscribeMessage('leave_product_chat')
  handleLeaveProductChat(@MessageBody() data: { productId: string }, @ConnectedSocket() client: Socket) {
    client.leave(`product_${data.productId}`);
  }

  @SubscribeMessage('send_message')
  handleSendMessage(@MessageBody() data: { productId: string; message: string; senderId: string; senderName: string }, @ConnectedSocket() client: Socket) {
    this.server.to(`product_${data.productId}`).emit('new_message', {
      message: data.message,
      senderId: data.senderId,
      senderName: data.senderName,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('acknowledge_alerta')
  handleAcknowledgeAlerta(@MessageBody() data: { alertaId: string; userId: string }, @ConnectedSocket() client: Socket) {
    client.emit('alerta_acknowledged', { alertaId: data.alertaId, userId: data.userId });
  }
}
