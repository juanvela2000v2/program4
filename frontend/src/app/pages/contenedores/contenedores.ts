import {
  Component,
  AfterViewInit
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ContenedoresService } from '../../services/contenedores';

@Component({
  selector: 'app-contenedores',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,RouterModule
  ],
  templateUrl: './contenedores.html',
  styleUrls: ['./contenedores.css']
})
export class ContenedoresComponent
implements AfterViewInit {

  private map: any;
  private L: any;
  private marker: any;

  // 📦 FORMULARIO
  nombre = '';
  estado = 'VACIO';
  nivel = 0;
  usuario = 'Administrador';
  lat = 0;
  lng = 0;
  paginaActual = 1;
  itemsPorPagina = 5;
  contenedores: any[] = [];

  constructor(
    private service: ContenedoresService
  ) {}

  async ngAfterViewInit() {

    if (typeof window === 'undefined') return;

    // 🔥 LEAFLET
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

    // 🗺️ MAPA POTOSÍ
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

    // 📍 CLICK MAPA
    this.map.on('click', (e: any) => {

      this.lat = e.latlng.lat;
      this.lng = e.latlng.lng;

      // borrar marker anterior
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }

      // nuevo marker
      this.marker = this.L.marker(
        [this.lat, this.lng]
      ).addTo(this.map);

    });

    // 📦 cargar contenedores
    this.listar();
  }

  // 💾 CREAR
  crear() {

    if (!this.nombre) {

      alert('Nombre requerido');

      return;
    }

    if (!this.lat || !this.lng) {

      alert('Seleccione ubicación en el mapa');

      return;
    }

    this.service.crear({

      nombre: this.nombre,

      estado: this.estado,

      nivel: this.nivel,

      lat: this.lat,

      lng: this.lng

    }).subscribe({

      next: () => {

        alert('Contenedor creado');

        this.limpiar();

        this.listar();

      },

      error: () => {

        alert('Error creando');

      }

    });

  }

  // 📋 LISTAR
  listar() {

    this.service.listar().subscribe({

      next: (res: any) => {

        this.contenedores = res;

        // 🔥 limpiar markers viejos
        this.map.eachLayer((layer: any) => {

          if (
            layer instanceof this.L.CircleMarker
          ) {
            this.map.removeLayer(layer);
          }

        });

        // 🔥 dibujar contenedores
        res.forEach((c: any) => {

          if (!c.lat || !c.lng) return;

          const color = this.getColor(c.estado);

          this.L.circleMarker(
            [c.lat, c.lng],
            {
              radius: 10,
              color,
              fillColor: color,
              fillOpacity: 0.8
            }
          )
          .addTo(this.map)
          .bindPopup(`
            <b>${c.nombre}</b><br>
            Estado: ${c.estado}<br>
            Nivel: ${c.nivel}%
          `);

        });

      }

    });

  }
  get contenedoresPaginados() {

  const inicio =
    (this.paginaActual - 1) * this.itemsPorPagina;

  const fin =
    inicio + this.itemsPorPagina;

  return this.contenedores.slice(inicio, fin);
}

totalPaginas() {

  return Math.ceil(
    this.contenedores.length / this.itemsPorPagina
  );

}

cambiarPagina(pagina: number) {

  if (pagina < 1) return;

  if (pagina > this.totalPaginas()) return;

  this.paginaActual = pagina;
}

  // 🎨 COLORES
  getColor(estado: string) {

    if (!estado) return 'gray';

    estado = estado.toUpperCase().trim();

    if (estado === 'LLENO') {
      return 'red';
    }

    if (estado === 'MEDIO') {
      return 'orange';
    }

    if (estado === 'VACIO') {
      return 'green';
    }

    return 'gray';
  }

  // 🧹 LIMPIAR
  limpiar() {

    this.nombre = '';

    this.estado = 'VACIO';

    this.nivel = 0;

    this.lat = 0;

    this.lng = 0;

    if (this.marker) {

      this.map.removeLayer(this.marker);

    }

  }

}