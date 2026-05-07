import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: process.env.FRONTEND_URL ?? 'http://localhost:4200', credentials: true } })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    client.emit('support:message', {
      from: 'support',
      text: 'Hola, cuentanos tu denuncia o problema. Un agente revisara el caso.',
      createdAt: new Date().toISOString(),
    });
  }

  @SubscribeMessage('support:join')
  joinSupport(@ConnectedSocket() client: Socket, @MessageBody() body: { roomId: string }) {
    client.join(body.roomId);
    return { ok: true, roomId: body.roomId };
  }

  @SubscribeMessage('support:message')
  sendSupportMessage(@ConnectedSocket() client: Socket, @MessageBody() body: { roomId: string; text: string }) {
    this.server.to(body.roomId).emit('support:message', {
      from: client.id,
      text: body.text,
      createdAt: new Date().toISOString(),
    });
  }
}
