import {
  Component, OnInit, OnDestroy, AfterViewInit,
  PLATFORM_ID, Inject, NgZone, ChangeDetectorRef
} from '@angular/core';
import { isPlatformBrowser, CommonModule, DecimalPipe, DatePipe, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService }          from '../../services/api.service';
import { AuthService }         from '../../services/auth.service';
import { SensorSocketService } from '../../services/sensor-socket.service';
import { ToastService }        from '../../services/toast.service';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DecimalPipe, DatePipe, SlicePipe],
  templateUrl: './mapa.html',
  styleUrl: './mapa.css',
})
export class MapaComponent implements OnInit, AfterViewInit, OnDestroy {
  private L: any;
  private map: any;
  private marcadoresSensores = new Map<number, any>(); // marcadores de ubicaciones
  private marcadoresReportes = new Map<number, any>(); // marcadores de reportes
  private subs: Subscription[] = [];

  sensores:     any[] = []; // ubicaciones con sensores
  alertasTabla: any[] = [];
  estadisticas: any = null;

  // Valores actuales por sensor (id_ubicacion -> {valor, nivel})
  sensorValores = new Map<number, { valor: number; nivel: string }>();

  // Modal nuevo reporte
  mostrarForm = false;
  clickLat = 0; clickLng = 0;
  form = { tipoProblema: '', descripcion: '', foto: null as File | null };
  enviando = false;

  // Modales admin
  resolverModal = { show: false, alertaId: 0, nota: '' };
  eliminarModal = { show: false, alertaId: 0 };

  readonly tipos = [
    { v: 'GASES_TOXICOS',      l: 'Gases Toxicos'     },
    { v: 'INCENDIO',           l: 'Incendio'           },
    { v: 'CONTAMINACION_AGUA', l: 'Contaminacion Agua' },
    { v: 'BASURA_ILEGAL',      l: 'Basura Ilegal'      },
    { v: 'DERRAME_QUIMICO',    l: 'Derrame Quimico'    },
    { v: 'QUEMA_NEUMATICOS',   l: 'Quema de Neumaticos'},
    { v: 'HUMO',               l: 'Humo / Polvo'       },
    { v: 'OTRO',               l: 'Otro'               },
  ];

  constructor(
    public  auth:      AuthService,
    private api:       ApiService,
    private socket:    SensorSocketService,
    private toast:     ToastService,
    private router:    Router,
    private ngZone:    NgZone,
    private cdr:       ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit() {
    this.cargarDatos();

    // Datos en tiempo real del sensor -> actualizar marcador del sensor
    this.subs.push(
      this.socket.onSensorDatos().subscribe(d => {
        this.ngZone.run(() => {
          if (d.ubicacion?.id) {
            this.sensorValores.set(d.ubicacion.id, { valor: d.valor, nivel: d.nivelTexto });
            this.actualizarMarcadorSensor(d.ubicacion.id, d.valor, d.nivelTexto);
          }
        });
      })
    );

    // Nueva alerta de sensor
    this.subs.push(
      this.socket.onNuevaAlerta().subscribe(a => {
        this.ngZone.run(() => {
          if (a.fuente === 'CIUDADANO') this.agregarMarcadorReporte(a);
          this.cargarDatos();
        });
      })
    );

    // Nuevo reporte ciudadano -> toast al admin
    this.subs.push(
      this.socket.onNuevoReporteCiudadano().subscribe(r => {
        this.ngZone.run(() => {
          if (this.auth.isAdmin) {
            this.toast.warning(`Nuevo reporte ciudadano: ${r.tipoProblema}`);
          }
          this.agregarMarcadorReporte(r);
          this.cdr.detectChanges();
        });
      })
    );
  }

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.L = await import('leaflet');
    this.initMap();
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
    this.map?.remove();
  }

  private initMap() {
  this.map = this.L.map('map', { doubleClickZoom: false })
    .setView([-19.5836, -65.7531], 13);

  this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'OpenStreetMap contributors',
  }).addTo(this.map);

  this.map.on('click', (e: any) => {
    this.ngZone.run(() => {
      this.clickLat = e.latlng.lat;
      this.clickLng = e.latlng.lng;
      this.mostrarForm = true;
      this.form = { tipoProblema: '', descripcion: '', foto: null };
      this.enviando = false;
      this.cdr.detectChanges();
    });
  });

  // 🔧 SOLO si es ADMIN, cargar sensores
  if (this.auth.isAdmin) {
    this.api.getUbicaciones().subscribe(lista => {
      lista.forEach(u => this.agregarMarcadorSensor(u, u.esVirtual ? 150 : 0, 'NORMAL'));
    });
  }

  // Cargar reportes (esto lo ven todos)
  this.api.getAlertas().subscribe(lista => {
    lista.filter((a: any) => a.fuente === 'CIUDADANO')
         .forEach((a: any) => this.agregarMarcadorReporte(a));
  });
}

  // ── Marcador de SENSOR (rectangulo) ──────────────────────────
  private agregarMarcadorSensor(ubicacion: any, valor: number, nivel: string) {
    if (!this.map || !this.L) return;
    const lat = +(ubicacion.latitud ?? 0);
    const lng = +(ubicacion.longitud ?? 0);
    if (!lat && !lng) return;

    const anterior = this.marcadoresSensores.get(ubicacion.id);
    if (anterior) this.map.removeLayer(anterior);

    const color    = this.colorNivel(nivel);
    const esF      = !ubicacion.esVirtual;
    const etiqueta = esF ? 'FISICO' : 'VIRTUAL';

    const icon = this.L.divIcon({
      className: '',
      html: `<div style="
        min-width:90px; padding:5px 10px;
        background:${color}dd; border:2px solid rgba(255,255,255,.85);
        border-radius:7px; box-shadow:0 3px 12px rgba(0,0,0,.45);
        text-align:center; cursor:pointer;
      ">
        <div style="font-size:9px;color:rgba(255,255,255,.75);font-weight:700;letter-spacing:.08em;">
          ${etiqueta}
        </div>
        <div style="font-size:10px;color:#fff;font-weight:700;white-space:nowrap;overflow:hidden;
          max-width:100px;text-overflow:ellipsis;">${ubicacion.nombre}</div>
        <div style="font-size:15px;color:#fff;font-weight:900;line-height:1.2;">${valor}</div>
        <div style="font-size:9px;color:rgba(255,255,255,.8);">RAW</div>
      </div>`,
      iconSize: [100, 60],
      iconAnchor: [50, 30],
    });

    const marker = this.L.marker([lat, lng], { icon, zIndexOffset: 1000 });

    const adminLink = this.auth.isAdmin
      ? `<br/><a id="link-sensor-${ubicacion.id}" style="
            display:block;margin-top:8px;text-align:center;padding:5px;
            background:#2563eb;color:#fff;border-radius:6px;
            text-decoration:none;font-size:12px;font-weight:700;">
            Ver Dashboard del Sensor
          </a>`
      : '';

    marker.bindPopup(`
      <div style="min-width:200px;font-family:'Segoe UI',sans-serif;">
        <div style="font-size:15px;font-weight:800;color:#1e293b;margin-bottom:4px;">
          ${ubicacion.nombre}
        </div>
        <span style="background:${esF ? '#f97316' : '#3b82f6'};color:#fff;
          padding:2px 10px;border-radius:12px;font-size:11px;">
          ${etiqueta}
        </span>
        <div style="margin:10px 0 4px;font-size:13px;color:#475569;">
          Valor actual: <b style="font-size:18px;color:${color};">${valor}</b> RAW
        </div>
        <div style="font-size:12px;color:#64748b;">
          Nivel:
          <span style="background:${color};color:#fff;padding:1px 8px;border-radius:10px;font-size:11px;">
            ${nivel}
          </span>
        </div>
        ${adminLink}
      </div>
    `, { maxWidth: 240 });

    marker.on('click', (e: any) => this.L.DomEvent.stopPropagation(e));

    marker.on('popupopen', () => {
      document.getElementById(`link-sensor-${ubicacion.id}`)
        ?.addEventListener('click', (e) => {
          e.preventDefault();
          this.ngZone.run(() => this.router.navigate(['/sensor', ubicacion.id]));
        });
    });

    marker.addTo(this.map);
    this.marcadoresSensores.set(ubicacion.id, marker);
  }

  private actualizarMarcadorSensor(ubicacionId: number, valor: number, nivel: string) {
    const mk = this.marcadoresSensores.get(ubicacionId);
    if (!mk || !this.L) return;

    const u     = { id: ubicacionId, nombre: mk.getPopup()?.getContent()?.toString()?.match(/<div style="font-size:15px[^>]+>([^<]+)/)?.[1] ?? '' };
    const color = this.colorNivel(nivel);

    // Actualizar icono con nuevo valor
    mk.setIcon(this.L.divIcon({
      className: '',
      html: `<div style="
        min-width:90px; padding:5px 10px;
        background:${color}dd; border:2px solid rgba(255,255,255,.85);
        border-radius:7px; box-shadow:0 3px 12px rgba(0,0,0,.45);
        text-align:center; cursor:pointer;
      ">
        <div style="font-size:15px;color:#fff;font-weight:900;line-height:1.4;">${valor}</div>
        <div style="font-size:9px;color:rgba(255,255,255,.8);">${nivel}</div>
      </div>`,
      iconSize: [90, 55],
      iconAnchor: [45, 27],
    }));
  }

  // ── Marcador de REPORTE ciudadano (circulo) ───────────────────
  private agregarMarcadorReporte(alerta: any) {
    if (!this.map || !this.L) return;
    const lat = +(alerta.latitud ?? alerta.ubicacion?.latitud ?? 0);
    const lng = +(alerta.longitud ?? alerta.ubicacion?.longitud ?? 0);
    if (!lat && !lng) return;

    const anterior = this.marcadoresReportes.get(alerta.id);
    if (anterior) this.map.removeLayer(anterior);

    const color = this.colorEstado(alerta.estado);
    const icon  = this.L.divIcon({
      className: '',
      html: `<div style="
        width:32px;height:32px;border-radius:50%;
        background:${color};border:3px solid rgba(255,255,255,.9);
        box-shadow:0 3px 10px rgba(0,0,0,.4),0 0 0 4px ${color}33;
        display:flex;align-items:center;justify-content:center;
        color:white;font-size:12px;font-weight:800;
      ">${alerta.reporteCount ?? 1}</div>`,
      iconSize: [32, 32], iconAnchor: [16, 16],
    });

    const marker = this.L.marker([lat, lng], { icon });

    const imgHtml = alerta.foto
      ? `<img src="http://localhost:3000${alerta.foto}"
             style="width:100%;max-height:110px;object-fit:cover;border-radius:6px;margin-top:8px;"/>`
      : '';

    const adminBtns = this.auth.isAdmin
      ? `<div style="display:flex;gap:6px;margin-top:10px;">
           <button id="res-${alerta.id}" style="flex:1;padding:6px;background:#16a34a;
             color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;">
             Resolver
           </button>
           <button id="del-${alerta.id}" style="flex:1;padding:6px;background:#dc2626;
             color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;">
             Eliminar
           </button>
         </div>`
      : '';

    marker.bindPopup(`
      <div style="min-width:210px;font-family:'Segoe UI',sans-serif;">
        <div style="font-size:15px;font-weight:700;margin-bottom:4px;">
          ${this.labelTipo(alerta.tipoProblema)}
        </div>
        <span style="background:${color};color:#fff;padding:2px 10px;border-radius:12px;font-size:11px;">
          ${alerta.estado}
        </span>
        <p style="margin:8px 0;font-size:13px;color:#4b5563;">
          ${alerta.descripcion ?? 'Sin descripcion'}
        </p>
        <small style="color:#9ca3af;">
          ${new Date(alerta.fechaReporte).toLocaleString('es-BO')} —
          ${alerta.reporteCount ?? 1} reporte(s)
        </small>
        ${imgHtml}${adminBtns}
      </div>
    `, { maxWidth: 270 });

    marker.on('click', (e: any) => this.L.DomEvent.stopPropagation(e));

    marker.on('popupopen', () => {
      document.getElementById(`res-${alerta.id}`)?.addEventListener('click', () =>
        this.ngZone.run(() => {
          this.resolverModal = { show: true, alertaId: alerta.id, nota: '' };
          this.cdr.detectChanges();
        })
      );
      document.getElementById(`del-${alerta.id}`)?.addEventListener('click', () =>
        this.ngZone.run(() => {
          this.eliminarModal = { show: true, alertaId: alerta.id };
          this.cdr.detectChanges();
        })
      );
    });

    marker.addTo(this.map);
    this.marcadoresReportes.set(alerta.id, marker);
  }

  private actualizarMarcadorResuelto(id: number) {
    const mk = this.marcadoresReportes.get(id);
    if (!mk || !this.L) return;
    mk.setIcon(this.L.divIcon({
      className: '',
      html: `<div style="width:32px;height:32px;border-radius:50%;
        background:#22c55e;border:3px solid rgba(255,255,255,.9);
        box-shadow:0 3px 10px rgba(0,0,0,.4);
        display:flex;align-items:center;justify-content:center;
        color:white;font-size:16px;font-weight:700;">&#10003;</div>`,
      iconSize: [32, 32], iconAnchor: [16, 16],
    }));
  }

  // ── Acciones admin ────────────────────────────────────────────
  confirmarResolver() {
    const { alertaId, nota } = this.resolverModal;
    this.api.resolverAlerta(alertaId, nota || 'Resuelto').subscribe({
      next: () => {
        this.actualizarMarcadorResuelto(alertaId);
        this.resolverModal = { show: false, alertaId: 0, nota: '' };
        this.map?.closePopup();
        this.toast.success('Alerta resuelta correctamente');
        this.cargarDatos();
      },
      error: () => this.toast.error('Error al resolver la alerta'),
    });
  }

  confirmarEliminar() {
    const id = this.eliminarModal.alertaId;
    this.api.eliminarAlerta(id).subscribe({
      next: () => {
        const mk = this.marcadoresReportes.get(id);
        if (mk) { this.map.removeLayer(mk); this.marcadoresReportes.delete(id); }
        this.eliminarModal = { show: false, alertaId: 0 };
        this.map?.closePopup();
        this.toast.success('Alerta eliminada');
        this.cargarDatos();
      },
      error: () => this.toast.error('Error al eliminar'),
    });
  }

  // ── Formulario reporte ────────────────────────────────────────
  onFoto(e: any) { this.form.foto = e.target.files[0] ?? null; }

  cerrarForm() {
    this.mostrarForm = false;
    this.enviando    = false;
    this.form        = { tipoProblema: '', descripcion: '', foto: null };
  }

  enviarReporte() {
    if (!this.form.tipoProblema) { this.toast.warning('Selecciona el tipo de problema'); return; }
    this.enviando = true;
    const fd = new FormData();
    fd.append('tipoProblema', this.form.tipoProblema);
    fd.append('descripcion',  this.form.descripcion);
    fd.append('latitud',  String(this.clickLat));
    fd.append('longitud', String(this.clickLng));
    if (this.form.foto) fd.append('foto', this.form.foto);
    if (this.auth.currentUser?.id) fd.append('usuarioId', String(this.auth.currentUser.id));

    this.api.crearReporteCiudadano(fd).subscribe({
      next: (a) => {
        this.cerrarForm();
        this.agregarMarcadorReporte(a);
        this.cargarDatos();
        this.toast.success('Reporte enviado. Gracias por contribuir a Potosi Limpio.');
      },
      error: (err) => {
        this.enviando = false;
        this.toast.error(err?.error?.message ?? 'Error al enviar. Intenta mas tarde.');
      },
    });
  }

cargarDatos() {
  this.subs.push(this.api.getAlertas().subscribe(a => {
    this.alertasTabla = a;
    this.cdr.detectChanges();
  }));
  
  this.subs.push(this.api.getEstadisticas().subscribe(s => {
    this.estadisticas = s;
    this.cdr.detectChanges();
  }));
  
  if (this.auth.isAdmin) {
    this.subs.push(this.api.getUbicaciones().subscribe(u => {
      this.sensores = u;
      this.cdr.detectChanges();
    }));
  }
}

  colorNivel(n: string) {
    return ({ NORMAL:'#22c55e', MODERADO:'#f97316', PELIGROSO:'#ef4444' } as any)[n] ?? '#3b82f6';
  }
  colorEstado(e: string) {
    return ({ URGENTE:'#ef4444', MODERADO:'#f97316', RESUELTO:'#22c55e' } as any)[e] ?? '#6b7280';
  }
  labelTipo(v: string) { return this.tipos.find(t => t.v === v)?.l ?? v; }

  get reportesCiudadanos() {
    return this.alertasTabla.filter(a => a.fuente === 'CIUDADANO');
  }

  get porTipo() {
    const g: Record<string, any[]> = {};
    this.reportesCiudadanos.forEach(a => (g[a.tipoProblema] ??= []).push(a));
    return Object.entries(g).map(([tipo, items]) => ({ tipo, items }));
  }
  // Agrega este método en la clase MapaComponent
getNivelSensor(sensorId: number): string {
  return this.sensorValores.get(sensorId)?.nivel ?? 'NORMAL';
}

getValorSensor(sensorId: number): number {
  return this.sensorValores.get(sensorId)?.valor ?? 0;
}
 get mostrarSensores(): boolean {
    return this.auth.isAdmin;
 }
}