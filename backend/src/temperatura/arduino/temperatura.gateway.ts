import {WebSocketGateway, WebSocketServer} from '@nestjs/websockets'
import {Server} from 'socket.io'
@WebSocketGateway({cors:true})
export class TemperaturaGateway{
    @WebSocketServer()
    server:Server;

    sendTemperatura(temp:number){
        this.server.emit('temperatura',temp);
    }
}