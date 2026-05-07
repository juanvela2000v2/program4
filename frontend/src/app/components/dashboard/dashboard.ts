import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ViewChild, ElementRef, PLATFORM_ID, inject, ChangeDetectorRef
} from '@angular/core';
import { isPlatformBrowser, CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { SensorSocketService } from '../../services/sensor-socket.service';
import { ApiService }          from '../../services/api.service';
import { AuthService }         from '../../services/auth.service';
import { ToastService }        from '../../services/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: false }) chartEl!: ElementRef<HTMLCanvasElement>;

  private platformId = inject(PLATFORM_ID);
  private cdr        = inject(ChangeDetectorRef);
  private chart: any;
  private subs: Subscription[] = [];
  readonly MAX = 40;

  // ── Sensor ────────────────────────────────────────────────────
  valorActual  = 0;
  nivelActual  = 'NORMAL';
  alertaSensor: any = null;
  reportesPendientes = 0;  // badge de notificaciones
  // ── Datos ─────────────────────────────────────────────────────
  alertas:     any[] = [];
  usuarios:    any[] = [];
  ubicaciones: any[] = [];
  estadisticas: any  = null;

  // ── Tabs ──────────────────────────────────────────────────────
  tab: 'alertas' | 'usuarios' | 'ubicaciones' = 'alertas';
  // Modificar el metodo que cambia el tab:
  setTab(t: 'alertas' | 'usuarios' | 'ubicaciones') {
    this.tab = t;
    if (t === 'alertas') this.reportesPendientes = 0;
    this.cargarTodo();
  }

  // ── Modales (sin alert/confirm/prompt) ────────────────────────
  resolverModal  = { show: false, alertaId: 0, nota: '' };
  eliminarModal  = { show: false, id: 0, tipo: '' as 'alerta'|'usuario'|'ubicacion' };
  rolModal       = { show: false, usuarioId: 0, nombre: '', rolActual: '', nuevoRol: '' };

  // ── Form nueva ubicación ──────────────────────────────────────
  formUbicacion = {
  nombre: '', latitud: '', longitud: '', tipoArea: 'MINERIA',
  descripcion: '', esVirtual: false,
  valorMinSimulado: 50, valorMaxSimulado: 800, intervaloSegundos: 5
};
  constructor(
    public  auth:   AuthService,
    private socket: SensorSocketService,
    private api:    ApiService,
    private toast:  ToastService,
  ) {}

  ngOnInit() {
    this.cargarTodo();
    this.socket.solicitarHistorico(2);
    this.subs.push(
      this.socket.onSensorDatos().subscribe(d => {
        this.valorActual  = d.valor ?? 0;
        this.nivelActual  = d.nivelTexto ?? this.calcNivel(this.valorActual);
        this.alertaSensor = d.alerta;
        this.pushPunto(this.valorActual, new Date());
        this.cdr.detectChanges();
      })
    );
    this.subs.push(
      this.socket.onHistorico().subscribe(hist => {
        hist.slice(-this.MAX).forEach(item =>
          this.pushPunto(item.valor, new Date(item.fecha))
        );
      })
    );
    this.subs.push(
  this.socket.onNuevoReporteCiudadano().subscribe(r => {
    if (this.tab !== 'alertas') {
      this.reportesPendientes++;
    }
    this.toast.warning(`Nuevo reporte ciudadano: ${r.tipoProblema}`);
    this.cdr.detectChanges();
  })
);
  }

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const { Chart, registerables } = await import('chart.js');
    Chart.register(...registerables);
    this.initChart(Chart);
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
    this.chart?.destroy();
  }

  private initChart(Chart: any) {
    if (!this.chartEl?.nativeElement) return;
    this.chart = new Chart(this.chartEl.nativeElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Sensor MQ-2 (RAW)',
          data: [],
          borderColor: '#f97316',
          backgroundColor: (ctx: any) => {
            const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
            g.addColorStop(0, 'rgba(249,115,22,.35)');
            g.addColorStop(1, 'rgba(249,115,22,.0)');
            return g;
          },
          borderWidth: 2.5,
          tension: 0.45,
          fill: true,
          pointRadius: 0,
          pointHitRadius: 10,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 200 },
        interaction: { mode: 'index', intersect: false },
        scales: {
          y: {
            min: 0, max: 1023,
            grid: { color: 'rgba(255,255,255,.06)' },
            ticks: { color: '#6b7280', font: { size: 11 } },
            title: { display: true, text: 'Valor RAW', color: '#6b7280' },
          },
          x: {
            grid: { color: 'rgba(255,255,255,.04)' },
            ticks: { color: '#6b7280', font: { size: 10 }, maxTicksLimit: 8 },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1f2937',
            borderColor: '#f97316',
            borderWidth: 1,
            titleColor: '#f9fafb',
            bodyColor: '#d1d5db',
            callbacks: {
              label: (ctx: any) => ` ${ctx.parsed.y} RAW — ${this.calcNivel(ctx.parsed.y)}`,
            },
          },
        },
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

  cargarTodo() {
    this.subs.push(this.api.getAlertas().subscribe(a  => { this.alertas     = a;  this.cdr.detectChanges(); }));
    this.subs.push(this.api.getEstadisticas().subscribe(s => { this.estadisticas = s; this.cdr.detectChanges(); }));
    this.subs.push(this.api.getUbicaciones().subscribe(u => { this.ubicaciones  = u; this.cdr.detectChanges(); }));
    this.subs.push(this.api.getUsuarios().subscribe(u  => { this.usuarios     = u;  this.cdr.detectChanges(); }));
  }

  // ── Alertas ───────────────────────────────────────────────────
  abrirResolver(id: number) {
    this.resolverModal = { show: true, alertaId: id, nota: '' };
  }
  confirmarResolver() {
    const { alertaId, nota } = this.resolverModal;
    this.api.resolverAlerta(alertaId, nota || 'Resuelto desde panel admin').subscribe({
      next: () => {
        this.resolverModal = { show: false, alertaId: 0, nota: '' };
        this.toast.success('✅ Alerta resuelta correctamente');
        this.cargarTodo();
      },
      error: () => this.toast.error('Error al resolver la alerta'),
    });
  }

  abrirEliminar(id: number, tipo: 'alerta'|'usuario'|'ubicacion') {
    this.eliminarModal = { show: true, id, tipo };
  }
  confirmarEliminar() {
    const { id, tipo } = this.eliminarModal;
    const obs = tipo === 'alerta'    ? this.api.eliminarAlerta(id)
              : tipo === 'usuario'   ? this.api.eliminarUsuario(id)
              : this.api.eliminarUbicacion(id);
    obs.subscribe({
      next: () => {
        this.eliminarModal = { show: false, id: 0, tipo: '' as any };
        this.toast.success('🗑️ Elemento eliminado');
        this.cargarTodo();
      },
      error: () => this.toast.error('Error al eliminar'),
    });
  }

  // ── Usuarios ──────────────────────────────────────────────────
  abrirCambiarRol(u: any) {
    this.rolModal = {
      show: true, usuarioId: u.id, nombre: u.nombre ?? u.email,
      rolActual: u.rol, nuevoRol: u.rol === 'ADMIN' ? 'CIUDADANO' : 'ADMIN',
    };
  }
  confirmarRol() {
    const { usuarioId, nuevoRol, nombre } = this.rolModal;
    this.api.cambiarRol(usuarioId, nuevoRol).subscribe({
      next: () => {
        this.rolModal = { show: false, usuarioId: 0, nombre: '', rolActual: '', nuevoRol: '' };
        this.toast.success(`🔑 ${nombre} ahora es ${nuevoRol}`);
        this.cargarTodo();
      },
      error: () => this.toast.error('Error al cambiar rol'),
    });
  }

  // ── Ubicaciones ───────────────────────────────────────────────
  // ── Ubicaciones ───────────────────────────────────────────────
crearUbicacion() {
  if (!this.formUbicacion.nombre || !this.formUbicacion.latitud || !this.formUbicacion.longitud) {
    this.toast.warning('Completá nombre, latitud y longitud');
    return;
  }
  
  this.api.crearUbicacion(this.formUbicacion).subscribe({
    next: () => {
      this.toast.success('📍 Ubicación creada');
      this.formUbicacion = { 
        nombre: '', 
        latitud: '', 
        longitud: '', 
        tipoArea: 'MINERIA',
        descripcion: '', 
        esVirtual: false,
        valorMinSimulado: 50,
        valorMaxSimulado: 800,
        intervaloSegundos: 5
      };
      this.cargarTodo();
    },
    error: () => this.toast.error('Error al crear ubicación'),
  });
}

  // ── Helpers ───────────────────────────────────────────────────
  calcNivel(v: number) {
    if (v < 300) return 'NORMAL';
    if (v < 600) return 'MODERADO';
    return 'PELIGROSO';
  }
  colorNivel(n: string) {
    return ({ NORMAL:'#22c55e', MODERADO:'#f97316', PELIGROSO:'#ef4444' } as any)[n] ?? '#6b7280';
  }
  colorEstado(e: string) {
    return ({ URGENTE:'#ef4444', MODERADO:'#f97316', RESUELTO:'#22c55e' } as any)[e] ?? '#6b7280';
  }
  nivelPct(v: number) { return Math.min((v / 1023) * 100, 100).toFixed(1); }
}