import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ViewChild, ElementRef, Inject, PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser, CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiService }          from '../../services/api.service';
import { SensorSocketService } from '../../services/sensor-socket.service';
import { AuthService }         from '../../services/auth.service';
import { ToastService }        from '../../services/toast.service';

@Component({
  selector: 'app-sensor-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DatePipe],
  templateUrl: './sensor-detail.html',
  styleUrl:    './sensor-detail.css',
})
export class SensorDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: false }) chartEl!: ElementRef<HTMLCanvasElement>;

  private chart: any;
  private subs: Subscription[] = [];
  readonly MAX = 50;

  sensorId!:   number;
  ubicacion:   any   = null;
  valorActual: number = 0;
  nivelActual: string = 'NORMAL';
  lecturas:    any[]  = [];
  alertas:     any[]  = [];

  // Configuracion (solo virtuales, solo admin)
  config = { valorMinSimulado: 50, valorMaxSimulado: 800, intervaloSegundos: 5 };
  editandoConfig = false;

  constructor(
    private route:  ActivatedRoute,
    private api:    ApiService,
    private socket: SensorSocketService,
    public  auth:   AuthService,
    private toast:  ToastService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit() {
    this.sensorId = +this.route.snapshot.paramMap.get('id')!;
    this.cargarDatos();

    this.subs.push(
      this.socket.onSensorDatos().subscribe(d => {
        if (d.ubicacion?.id !== this.sensorId) return;
        this.valorActual = d.valor ?? 0;
        this.nivelActual = d.nivelTexto ?? this.nivel(this.valorActual);
        this.pushPunto(this.valorActual, new Date());
      })
    );
  }

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const { Chart, registerables } = await import('chart.js');
    Chart.register(...registerables);
    this.initChart(Chart);

    this.socket.solicitarHistoricoSensor(this.sensorId);
    this.subs.push(
      this.socket.onHistoricoSensor(this.sensorId).subscribe(hist => {
        hist.slice(-this.MAX).forEach(item =>
          this.pushPunto(item.valor, new Date(item.fecha))
        );
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
    this.chart?.destroy();
  }

  cargarDatos() {
    this.subs.push(
      this.api.getUbicacionById(this.sensorId).subscribe(u => {
        this.ubicacion = u;
        if (u) {
          this.config.valorMinSimulado  = u.valorMinSimulado;
          this.config.valorMaxSimulado  = u.valorMaxSimulado;
          this.config.intervaloSegundos = u.intervaloSegundos;
        }
      })
    );
    this.subs.push(
      this.api.getSensoresPorUbicacion(this.sensorId).subscribe(lecturas => {
        this.lecturas = lecturas.slice(0, 20);
        if (lecturas.length) {
          this.valorActual = lecturas[0].valor;
          this.nivelActual = this.nivel(this.valorActual);
        }
      })
    );
    this.subs.push(
      this.api.getAlertasPorUbicacion(this.sensorId).subscribe(a => this.alertas = a)
    );
  }

  private initChart(Chart: any) {
    if (!this.chartEl?.nativeElement) return;
    this.chart = new Chart(this.chartEl.nativeElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'RAW',
          data: [],
          borderColor: '#3b82f6',
          backgroundColor: (ctx: any) => {
            const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 280);
            g.addColorStop(0, 'rgba(59,130,246,.3)');
            g.addColorStop(1, 'rgba(59,130,246,0)');
            return g;
          },
          borderWidth: 2.5,
          tension: 0.45,
          fill: true,
          pointRadius: 0,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 200 },
        scales: {
          y: { min: 0, max: 1023,
               grid: { color: 'rgba(255,255,255,.06)' },
               ticks: { color: '#6b7280' } },
          x: { grid: { color: 'rgba(255,255,255,.04)' },
               ticks: { color: '#6b7280', maxTicksLimit: 8 } },
        },
        plugins: { legend: { display: false } },
      },
    });
  }

  private pushPunto(valor: number, fecha: Date) {
    if (!this.chart) return;
    const labels = this.chart.data.labels as string[];
    const data   = this.chart.data.datasets[0].data as number[];
    labels.push(fecha.toLocaleTimeString('es-BO', { hour:'2-digit', minute:'2-digit', second:'2-digit' }));
    data.push(valor);
    if (labels.length > this.MAX) { labels.shift(); data.shift(); }
    this.chart.update('none');
  }

  guardarConfig() {
    this.api.actualizarUbicacion(this.sensorId, this.config).subscribe({
      next: () => {
        this.editandoConfig = false;
        this.toast.success('Configuracion actualizada. El simulador se reiniciara.');
        // El backend no reinicia automaticamente el intervalo con PUT
        // Se necesita un endpoint especifico o reiniciar el servicio
        // Por ahora notificar al admin que lo recargue
      },
      error: () => this.toast.error('Error al guardar configuracion'),
    });
  }

  nivel(v: number) {
    if (v < 300) return 'NORMAL';
    if (v < 600) return 'MODERADO';
    return 'PELIGROSO';
  }

  colorNivel(n: string) {
    return ({ NORMAL: '#22c55e', MODERADO: '#f97316', PELIGROSO: '#ef4444' } as any)[n] ?? '#6b7280';
  }

  colorEstado(e: string) {
    return ({ URGENTE: '#ef4444', MODERADO: '#f97316', RESUELTO: '#22c55e' } as any)[e] ?? '#6b7280';
  }

  pct(v: number) { return Math.min((v / 1023) * 100, 100).toFixed(1); }
}