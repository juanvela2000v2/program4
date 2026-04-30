import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket;
  public datoTemperatura :WritableSignal<any>=signal(0);
  constructor() {
    this.socket = io('http://localhost:3000');
    this.socket.on('temperatura',dataTemp=>{
      this.datoTemperatura.set(dataTemp);
    })
  }

  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }
}