import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class WsService {
  private _server!: Server;
  set server(s: Server) { this._server = s; }
  emit(event: string, data: any) {
    if (this._server) this._server.emit(event, data);
  }
}