import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Route } from '@angular/router';
import { AutenticacionComponent } from './features/autenticacion/autenticacion.component';
import { UsuariosComponent } from './features/usuarios/usuarios.component';
import { MercadoComponent } from './features/mercado/mercado.component';
import { SubastasComponent } from './features/subastas/subastas.component';
import { PagosComponent } from './features/pagos/pagos.component';
import { AlertasComponent } from './features/alertas/alertas.component';
import { TableroComponent } from './features/tablero/tablero.component';
import { ProductoDetalleComponent } from './features/producto-detalle/producto-detalle.component';
import { VenderComponent } from './features/vender/vender.component';

const routes: Route[] = [
  { path: '', component: AutenticacionComponent },
  { path: 'autenticacion', component: AutenticacionComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'mercado', component: MercadoComponent },
  { path: 'producto/:id', component: ProductoDetalleComponent },
  { path: 'vender', component: VenderComponent },
  { path: 'subastas', component: SubastasComponent },
  { path: 'pagos', component: PagosComponent },
  { path: 'alertas', component: AlertasComponent },
  { path: 'tablero', component: TableroComponent },
];

export const appProviders = [
  provideHttpClient(),
  provideRouter(routes),
];
