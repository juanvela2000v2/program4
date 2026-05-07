import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class SensorSocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000', { transports: ['websocket'] });
  }

  onSensorDatos(): Observable<any> {
    return new Observable(obs => {
      this.socket.on('sensor-datos', d => obs.next(d));
      // 🔧 Devolver función de limpieza
      return () => {
        this.socket.off('sensor-datos');
      };
    });
  }

  onNuevaAlerta(): Observable<any> {
    return new Observable(obs => {
      this.socket.on('nueva-alerta', d => obs.next(d));
      return () => {
        this.socket.off('nueva-alerta');
      };
    });
  }

  onNuevoReporteCiudadano(): Observable<any> {
    return new Observable(obs => {
      this.socket.on('nuevo-reporte-ciudadano', d => obs.next(d));
      return () => {
        this.socket.off('nuevo-reporte-ciudadano');
      };
    });
  }

  solicitarHistorico(horas = 2) {
    this.socket.emit('solicitar-historico', { horas });
  }

  onHistorico(): Observable<any[]> {
    return new Observable(obs => {
      this.socket.on('historico-datos', d => obs.next(d));
      return () => {
        this.socket.off('historico-datos');
      };
    });
  }

  solicitarHistoricoSensor(ubicacionId: number) {
    this.socket.emit('solicitar-historico-sensor', { ubicacionId });
  }

  onHistoricoSensor(ubicacionId: number): Observable<any[]> {
    return new Observable(obs => {
      this.socket.on(`historico-sensor-${ubicacionId}`, d => obs.next(d));
      return () => {
        this.socket.off(`historico-sensor-${ubicacionId}`);
      };
    });
  }
}