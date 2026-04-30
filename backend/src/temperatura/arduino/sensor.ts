import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { TemperaturaService } from "../temperatura.service";
import { TemperaturaGateway } from "./temperatura.gateway";
import { SerialPort } from "serialport";

//npm install serialport 
// @nestjs/websockets 
// @nestjs/platform-socket.io

@Injectable()
export class SerialService implements OnModuleInit{
    private port: SerialPort;
    constructor(
        private temperaturaService:TemperaturaService,
        private gateway:TemperaturaGateway
    ){}
    onModuleInit() {
        this.port = new SerialPort({
            path:'COM4',
            baudRate:9600,
        });
        this.port.on('data',async(data)=>{
            const value = parseFloat(data.toString());
            if(!isNaN(value)){
                await this.temperaturaService.guardar(value);
                this.gateway.sendTemperatura(value);
                console.log('temp:',value);
            }
        })
    }
}