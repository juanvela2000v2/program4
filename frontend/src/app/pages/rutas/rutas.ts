import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ContenedoresService } from '../../services/contenedores';
import { RutasService } from '../../services/rutas';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-rutas',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './rutas.html',
  styleUrls: ['./rutas.css']
})
export class RutasComponent implements AfterViewInit {

  private map: any;
  private L: any;

  puntosRuta: any[] = [];
  lineaRuta: any;

  nombreRuta = '';

  constructor(
    private contenedoresService: ContenedoresService,
    private rutasService: RutasService
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

    this.cargarContenedores();

    this.cargarRutas();
  }

  cargarContenedores() {

    this.contenedoresService.listar().subscribe({

      next: (res: any) => {

        res.forEach((c: any) => {

            if (!c.lat || !c.lng) return;

            const color = this.getColor(c.estado);

           
            const marker = this.L.circleMarker(
              [c.lat, c.lng],
              {
                radius: 10,
                color,
                fillColor: color,
                fillOpacity: 0.8
              }
            ).addTo(this.map);

            
            const puedeRecolectar =
  c.estado?.toUpperCase() === 'LLENO';

marker.bindPopup(`
  <b>${c.nombre}</b><br>
  Estado: ${c.estado}<br>
  Nivel: ${c.nivel ?? 0}%<br><br>

  ${
    c.estado?.toUpperCase() === 'LLENO'
      ? `<button id="btn-recolectar-${c.id}" 
          style="
            background:#27ae60;
            color:white;
            border:none;
            padding:6px 10px;
            border-radius:8px;
            cursor:pointer;
          ">
          🚛 Recolectar
        </button>`
      : `<small>✅ No necesita recolección</small>`
  }
`);
marker.on('popupopen', () => {

  const btn = document.getElementById(
    `btn-recolectar-${c.id}`
  );

  if (btn) {

    btn.addEventListener('click', () => {

      this.recolectarContenedor(c, marker);

    });

  }

});

            marker.on('click', () => {
              
if (c.estado?.toUpperCase() !== 'LLENO') {


  return;
}

             
              const existe = this.puntosRuta.find(
                p => p.id === c.id
              );

              if (existe) {

                const confirmar = confirm(
                  `¿Recolectar basura de ${c.nombre}?`
                );

                if (!confirmar) return;

                this.contenedoresService.actualizar(
                  c.id,
                  {
                    estado: 'VACIO',
                    nivel: 0
                  }
                ).subscribe({

                  next: () => {

                    
                    this.map.removeLayer(marker);

                    this.puntosRuta =
                      this.puntosRuta.filter(
                        p => p.id !== c.id
                      );

                    this.redibujarRuta();

                    alert('Basura recolectada');
                  },

                  error: () => {
                    alert('Error actualizando');
                  }

                });

                return;
              }

              this.agregarARuta(c);

            });

          });

      },

      error: () => {

        console.error(
          'Error cargando contenedores'
        );

      }

    });

  }
  recolectarContenedor(c: any, marker: any) {

  const confirmar = confirm(
    `¿Recolectar basura de ${c.nombre}?`
  );

  if (!confirmar) return;

  this.contenedoresService.actualizar(
    c.id,
    {
      estado: 'VACIO',
      nivel: 0
    }
  ).subscribe({

    next: () => {
      
  c.estado = 'VACIO';
  c.nivel = 0;

  const nuevoColor = this.getColor('VACIO');

  marker.setStyle({
    color: nuevoColor,
    fillColor: nuevoColor
  });

    
      this.puntosRuta =
        this.puntosRuta.filter(p => p.id !== c.id);

      this.redibujarRuta();

      alert('♻️ Contenedor recolectado');

    },

    error: () => {
      alert('Error al recolectar');
    }

  });

}


  agregarARuta(contenedor: any) {

    // evitar duplicados
    const existe = this.puntosRuta.find(
      p => p.id === contenedor.id
    );

    if (existe) {

      alert('Ya está en la ruta');

      return;
    }


    this.puntosRuta.push(contenedor);

  
    this.redibujarRuta();
  }

  redibujarRuta() {

    if (this.lineaRuta) {

      this.map.removeLayer(this.lineaRuta);

    }

    if (this.puntosRuta.length < 2) {

      return;

    }

    const puntos = this.puntosRuta.map(
      p => [p.lat, p.lng]
    );

    this.lineaRuta = this.L.polyline(
      puntos,
      {
        color: 'blue',
        weight: 4
      }
    ).addTo(this.map);

  }

  guardarRuta() {

    if (!this.nombreRuta.trim()) {

      alert('Nombre requerido');

      return;
    }

    if (this.puntosRuta.length < 2) {

      alert('Agrega mínimo 2 contenedores');

      return;
    }

    const puntos = this.puntosRuta.map(
      p => ({
        lat: p.lat,
        lng: p.lng
      })
    );

    this.rutasService.crear({

      nombre: this.nombreRuta,

      puntos

    }).subscribe({

      next: () => {

        alert('Ruta guardada');

       
        this.nombreRuta = '';

        this.puntosRuta = [];

       
        if (this.lineaRuta) {

          this.map.removeLayer(
            this.lineaRuta
          );

        }

      },

      error: () => {

        alert('Error guardando ruta');

      }

    });

  }

  cargarRutas() {

    this.rutasService.listar().subscribe({

      next: (res: any) => {

        res.forEach((ruta: any) => {

          const puntos = ruta.puntos.map(
            (p: any) => [p.lat, p.lng]
          );

          this.L.polyline(
            puntos,
            {
              color: 'purple',
              weight: 5
            }
          )
          .addTo(this.map)
          .bindPopup(`
            <b>${ruta.nombre}</b>
          `);

        });

      },

      error: () => {

        console.error(
          'Error cargando rutas'
        );

      }

    });

  }

  getColor(estado: string) {

    estado = estado?.toUpperCase();

    if (estado === 'LLENO') {

      return 'red';

    }

    if (estado === 'MEDIO') {

      return 'orange';

    }

    return 'green';
  }

}