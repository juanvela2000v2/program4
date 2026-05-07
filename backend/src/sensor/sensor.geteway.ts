import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SensorService } from './sensor.service';
import { WsService }     from '../shared/ws.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class SensorGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private sensorService: SensorService, private wsService: WsService) {}

  afterInit(server: Server) {
    this.sensorService.server = server;
    this.wsService.server     = server;
    console.log('WebSocket Gateway listo');
  }

  handleConnection(client: Socket) {
    client.emit('conexion', { message: 'Conectado a Potosi Limpio', timestamp: new Date() });
  }

  handleDisconnect(_: Socket) {}

  @SubscribeMessage('solicitar-historico')
  async onHistorico(client: Socket, data: { horas: number }) {
    client.emit('historico-datos', await this.sensorService.obtenerHistoricoSensores(data.horas || 24));
  }

  @SubscribeMessage('solicitar-historico-sensor')
  async onHistoricoSensor(client: Socket, data: { ubicacionId: number }) {
    const historico = await this.sensorService.obtenerSensoresPorUbicacion(data.ubicacionId);
    client.emit(`historico-sensor-${data.ubicacionId}`, historico);
  }
}