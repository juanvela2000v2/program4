  import {Component,AfterViewInit,NgZone,ChangeDetectorRef} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ContenedoresService } from '../../services/contenedores';
import { ReportesService } from '../../services/reportes';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './mapa.html',
  styleUrls: ['./mapa.css']
})
export class MapaComponent implements AfterViewInit {

  private map: any;
  private L: any;

  mostrarModal = false;

  descripcion = '';
  estado = 'LLENO';

  contenedorSeleccionado = 0;

  constructor(
    private contenedoresService: ContenedoresService,
    private reportesService: ReportesService,
    private ngZone: NgZone,
  private cd: ChangeDetectorRef
  ) {}

  async ngAfterViewInit() {

    if (typeof window === 'undefined') return;

    this.L = await import('leaflet');

    delete (this.L.Icon.Default.prototype as any)._getIconUrl;

    this.L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',

      iconUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',

      shadowUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
    });

   this.map = this.L.map('map').setView(
      [-19.5836, -65.7531],
      14
    );

    this.L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: 'OpenStreetMap'
      }
    ).addTo(this.map);

    // 📦 CARGAR DATOS
    this.cargarContenedores();
    this.cargarReportes();
  }

  abrirReporte(id: number) {

  this.ngZone.run(() => {

    this.contenedorSeleccionado = id;

    this.mostrarModal = true;

    this.cd.detectChanges();

    console.log('MODAL ABIERTO');

  });

}

  cargarContenedores() {

    this.contenedoresService.listar().subscribe({

      next: (res: any) => {

        res.forEach((c: any) => {

          if (!c.lat || !c.lng) return;

          const color =
            this.getColorContenedor(c.estado);

          const marker = this.L.circleMarker(
            [c.lat, c.lng],
            {
              radius: 10,
              color,
              fillColor: color,
              fillOpacity: 0.8
            }
          ).addTo(this.map);

          marker.bindPopup(`
  <b>${c.nombre}</b><br>
  Estado: ${c.estado}<br>
  Nivel: ${c.nivel ?? 0}%<br><br>

  <button
    id="btn-reporte-${c.id}"
    style="
      background:#2563eb;
      color:white;
      border:none;
      padding:6px 10px;
      border-radius:6px;
      cursor:pointer;
    "
  >
    Reportar
  </button>
`);

          marker.on('popupopen', () => {

  setTimeout(() => {

    const btn = document.getElementById(
      `btn-reporte-${c.id}`
    );

    if (btn) {

      btn.addEventListener('click', () => {

        this.ngZone.run(() => {

          this.abrirReporte(c.id);

        });

      });

    }

  }, 100);

});

        });

      },

      error: (err) => {
        console.error(
          'Error cargando contenedores',
          err
        );
      }

    });

  }

  cargarReportes() {

    this.reportesService.listar().subscribe({

      next: (res: any) => {

        res.forEach((r: any) => {

          if (!r.contenedor) return;

          const color =
            this.getColorReporte(r.estado);

          this.L.circleMarker(
            [
              r.contenedor.lat,
              r.contenedor.lng
            ],
            {
              radius: 7,
              color,
              fillColor: color,
              fillOpacity: 0.9
            }
          )
          .addTo(this.map)
          .bindPopup(`
            <b>Reporte</b><br>
            ${r.descripcion}<br>
            Estado: ${r.estado}
          `);

        });

      },

      error: (err) => {
        console.error(
          'Error cargando reportes',
          err
        );
      }

    });

  }
  guardarReporte() {

    if (!this.descripcion.trim()) {

      alert('Ingrese descripción');

      return;
    }

    this.reportesService.crear({

      descripcion: this.descripcion,

      estado: this.estado,

      contenedorId:
        this.contenedorSeleccionado,

      usuarioId: 1

    }).subscribe({

      next: () => {

        alert('Reporte guardado');

        this.cerrarModal();

        this.cargarReportes();

      },

      error: (err) => {

        console.error(err);

        alert('Error guardando reporte');
      }

    });

  }

  cerrarModal() {

  this.ngZone.run(() => {

    this.mostrarModal = false;

    this.descripcion = '';

    this.estado = 'LLENO';

    this.contenedorSeleccionado = 0;

    this.cd.detectChanges();

    console.log('MODAL CERRADO');

  });

}

  getColorContenedor(
    estado: string
  ) {

    estado = estado?.toUpperCase();

    if (estado === 'LLENO')
      return 'red';

    if (estado === 'MEDIO')
      return 'orange';

    return 'green';
  }

  getColorReporte(
    estado: string
  ) {

    estado = estado?.toUpperCase();

    if (estado === 'LLENO')
      return 'red';

    if (estado === 'MEDIO')
      return 'orange';

    if (estado === 'VACIO')
      return 'green';

    return 'gray';
  }

}
