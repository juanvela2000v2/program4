import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { Sensor }    from '../entities/sensor.entity';
import { Ubicacion } from '../entities/ubicacion.entity';
import { Alerta }    from '../entities/alerta.entity';
import { WsService } from '../shared/ws.service';

@Injectable()
export class SimuladorService implements OnModuleInit, OnModuleDestroy {
  private intervalos      = new Map<number, NodeJS.Timeout>();
  private valoresActuales = new Map<number, number>();

  constructor(
    @InjectRepository(Sensor)    private sensorRepo:    Repository<Sensor>,
    @InjectRepository(Ubicacion) private ubicacionRepo: Repository<Ubicacion>,
    @InjectRepository(Alerta)    private alertaRepo:    Repository<Alerta>,
    private ws: WsService,
  ) {}

  async onModuleInit() {
    const virtuales = await this.ubicacionRepo.find({ where: { esVirtual: true } });
    for (const u of virtuales) this.iniciar(u);
    if (virtuales.length) console.log(`Simulador: ${virtuales.length} sensor(es) virtual(es) activo(s)`);
  }

  onModuleDestroy() {
    this.intervalos.forEach(t => clearInterval(t));
  }

  @OnEvent('ubicacion.creada')
  onCreada(u: Ubicacion) { if (u.esVirtual) this.iniciar(u); }

  @OnEvent('ubicacion.eliminada')
  onEliminada(id: number) {
    const t = this.intervalos.get(id);
    if (t) { clearInterval(t); this.intervalos.delete(id); }
  }

  iniciar(u: Ubicacion) {
    const ant = this.intervalos.get(u.id);
    if (ant) clearInterval(ant);

    const min = u.valorMinSimulado ?? 50;
    const max = u.valorMaxSimulado ?? 800;

    if (!this.valoresActuales.has(u.id))
      this.valoresActuales.set(u.id, Math.round((min + max) / 2));

    const timer = setInterval(() => this.tick(u, min, max), (u.intervaloSegundos ?? 5) * 1000);
    this.intervalos.set(u.id, timer);
    console.log(`Simulando: ${u.nombre} (${min}-${max} RAW cada ${u.intervaloSegundos}s)`);
  }

  private async tick(u: Ubicacion, min: number, max: number) {
    try {
      const actual = this.valoresActuales.get(u.id)!;
      const delta  = (Math.random() - 0.5) * (max - min) * 0.12;
      const nuevo  = Math.round(Math.max(min, Math.min(max, actual + delta)));
      this.valoresActuales.set(u.id, nuevo);

      const guardado = await this.sensorRepo.save(
        this.sensorRepo.create({ tipo: 'GAS', valor: nuevo, unidad: 'RAW', ubicacion: u })
      );
      const alerta = await this.verificarAlerta(nuevo, u);

      this.ws.emit('sensor-datos', {
        id: guardado.id, tipo: 'GAS', valor: nuevo,
        nivelTexto: this.nivel(nuevo), unidad: 'RAW', esVirtual: true,
        ubicacion: { id: u.id, nombre: u.nombre, latitud: u.latitud, longitud: u.longitud },
        timestamp: guardado.fecha,
        alerta: alerta ? { id: alerta.id, estado: alerta.estado, tipo: alerta.tipoProblema } : null,
      });

      if (alerta) {
        this.ws.emit('nueva-alerta', {
          id: alerta.id, tipoProblema: alerta.tipoProblema, estado: alerta.estado,
          latitud: u.latitud, longitud: u.longitud, fuente: 'SENSOR',
        });
      }
    } catch (e: any) { console.error('Simulador error:', e.message); }
  }

  private nivel(v: number) {
    if (v < 300) return 'NORMAL';
    if (v < 600) return 'MODERADO';
    return 'PELIGROSO';
  }

  private async verificarAlerta(valor: number, u: Ubicacion): Promise<Alerta | null> {
    let estado: 'URGENTE' | 'MODERADO' | null = null;
    let tipoProblema = '';
    if (valor >= 600) { estado = 'URGENTE'; tipoProblema = 'GASES_TOXICOS'; }
    else if (valor >= 300) { estado = 'MODERADO'; tipoProblema = 'HUMO_DETECTADO'; }
    if (!estado) return null;

    const existe = await this.alertaRepo.findOne({
      where: { ubicacion: { id: u.id }, tipoProblema, estado }
    });
    if (existe) return existe;

    return this.alertaRepo.save(this.alertaRepo.create({
      tipoProblema, estado, fuente: 'SENSOR',
      descripcion: `${u.nombre}: ${valor} RAW — ${tipoProblema.replace(/_/g,' ')}`,
      latitud: u.latitud, longitud: u.longitud, ubicacion: u,
    }));
  }
}