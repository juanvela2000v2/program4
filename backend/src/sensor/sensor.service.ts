import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { Sensor }    from '../entities/sensor.entity';
import { Ubicacion } from '../entities/ubicacion.entity';
import { Alerta }    from '../entities/alerta.entity';
import { Server }    from 'socket.io';

@Injectable()
export class SensorService implements OnModuleInit {
  public server!: Server;
  private port!: SerialPort;
  private parser!: ReadlineParser;
  private ultimoValorMQ2 = 0;

  constructor(
    @InjectRepository(Sensor)    private sensorRepo:    Repository<Sensor>,
    @InjectRepository(Ubicacion) private ubicacionRepo: Repository<Ubicacion>,
    @InjectRepository(Alerta)    private alertaRepo:    Repository<Alerta>,
  ) {}

  async onModuleInit() { await this.inicializarArduino(); }

  async inicializarArduino() {
    try {
      const puerto   = process.env.ARDUINO_PORT || 'COM5';
      const baudRate = parseInt(process.env.ARDUINO_BAUD || '9600');
      this.port   = new SerialPort({ path: puerto, baudRate });
      this.parser = this.port.pipe(new ReadlineParser({ delimiter: '\n' }));
      this.parser.on('data', async (linea: string) => await this.procesarLinea(linea.trim()));
      this.port.on('error', (err: any) => {
        console.error('❌ Error Arduino:', err.message);
        setTimeout(() => this.inicializarArduino(), 5000);
      });
      console.log(`✅ Conectado a Arduino en ${puerto}`);
    } catch (err: any) {
      console.error('❌ No se pudo conectar:', err.message);
      setTimeout(() => this.inicializarArduino(), 5000);
    }
  }

  async procesarLinea(linea: string) {
    try {
      let valorRaw: number;
      if (linea.includes(':')) {
        const [, v] = linea.split(':');
        valorRaw = parseFloat(v.trim());
      } else {
        valorRaw = parseFloat(linea);
      }
      if (isNaN(valorRaw)) return;

      this.ultimoValorMQ2 = valorRaw;
      console.log('📊 MQ-2:', valorRaw, '→', this.nivelGas(valorRaw));

      const ubicacion = await this.ubicacionRepo.findOne({ where: {}, order: { id: 'ASC' } });
      if (!ubicacion) {
        if (this.server) this.server.emit('sensor-datos', {
          tipo: 'GAS', valor: valorRaw, nivelTexto: this.nivelGas(valorRaw),
          unidad: 'RAW', timestamp: new Date(), alerta: null
        });
        return;
      }

      const sensor = this.sensorRepo.create({ tipo: 'GAS', valor: valorRaw, unidad: 'RAW', ubicacion });
      const guardado = await this.sensorRepo.save(sensor);
      const alerta = await this.verificarAlerta(valorRaw, ubicacion);

      if (this.server) {
        this.server.emit('sensor-datos', {
          id: guardado.id,
          tipo: 'GAS',
          valor: valorRaw,
          nivelTexto: this.nivelGas(valorRaw),
          unidad: 'RAW',
          ubicacion: { id: ubicacion.id, nombre: ubicacion.nombre,
                       latitud: ubicacion.latitud, longitud: ubicacion.longitud },
          timestamp: guardado.fecha,
          alerta: alerta ? { id: alerta.id, estado: alerta.estado, tipo: alerta.tipoProblema } : null,
        });

        // ← NUEVO: avisar al mapa de una nueva alerta del sensor
        if (alerta) {
          this.server.emit('nueva-alerta', {
            id: alerta.id,
            tipoProblema: alerta.tipoProblema,
            estado: alerta.estado,
            descripcion: alerta.descripcion,
            latitud: ubicacion.latitud,
            longitud: ubicacion.longitud,
            reporteCount: alerta.reporteCount,
            fechaReporte: alerta.fechaReporte,
            fuente: 'SENSOR',
          });
        }
      }
    } catch (err: any) { console.error('❌ Error:', err.message); }
  }

  nivelGas(v: number): string {
    if (v < 300) return 'NORMAL';
    if (v < 600) return 'MODERADO';
    return 'PELIGROSO';
  }

  private async verificarAlerta(valor: number, ubicacion: Ubicacion): Promise<Alerta | null> {
    let estado: 'URGENTE' | 'MODERADO' | null = null;
    let tipoProblema = '';
    if (valor >= 600) { estado = 'URGENTE'; tipoProblema = 'GASES_TOXICOS'; }
    else if (valor >= 300) { estado = 'MODERADO'; tipoProblema = 'HUMO_DETECTADO'; }
    if (!estado) return null;

    const existente = await this.alertaRepo.findOne({
      where: { ubicacion: { id: ubicacion.id }, tipoProblema, estado }
    });
    if (existente) return existente;

    const nueva = this.alertaRepo.create({
      tipoProblema, estado, fuente: 'SENSOR',
      descripcion: `Sensor MQ-2: ${valor} RAW en ${ubicacion.nombre}.`,
      latitud: ubicacion.latitud,
      longitud: ubicacion.longitud,
      ubicacion,
    });
    return await this.alertaRepo.save(nueva);
  }

  async obtenerUltimoValor(tipo: string) {
    return this.sensorRepo.findOne({ where: { tipo }, order: { fecha: 'DESC' }, relations: ['ubicacion'] });
  }

  async obtenerSensoresPorUbicacion(ubicacionId: number) {
    return this.sensorRepo.find({
      where: { ubicacion: { id: ubicacionId } },
      relations: ['ubicacion'], order: { fecha: 'DESC' }, take: 100,
    });
  }

  async obtenerHistoricoSensores(horas = 24) {
    const desde = new Date();
    desde.setHours(desde.getHours() - horas);
    return this.sensorRepo.find({
      where: { fecha: MoreThan(desde) }, relations: ['ubicacion'], order: { fecha: 'ASC' }
    });
  }

  getUltimoValorMQ2() { return this.ultimoValorMQ2; }
}