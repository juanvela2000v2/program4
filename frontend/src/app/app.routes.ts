import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { ContenedoresComponent } from './pages/contenedores/contenedores';
import { AuthGuard } from './guards/auth-guard';
import { MapaComponent } from './pages/mapa/mapa';
import { MenuComponent } from './pages/menu/menu';

export const routes: Routes = [
    { path: '', component: LoginComponent },
  { path: 'contenedores', component: ContenedoresComponent },
  { path: 'mapa', component: MapaComponent },
  { path: 'menu', component: MenuComponent, canActivate: [AuthGuard] },
  {
  path: 'rutas',
  loadComponent: () =>
    import('./pages/rutas/rutas')
    .then(m => m.RutasComponent)
}
];
