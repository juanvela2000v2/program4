import { Routes } from '@angular/router';
<<<<<<< HEAD

export const routes: Routes = [];
=======
import { MapaComponent }         from './components/mapa/mapa';
import { DashboardComponent }    from './components/dashboard/dashboard';
import { SensorDetailComponent } from './components/sensor-detail/sensor-detail'; 
import { LoginComponent }        from './components/login/login';
import { RegisterComponent }     from './components/register/register';
import { adminGuard }            from './components/guards/admin.guard';

export const routes: Routes = [
  { path: '',          redirectTo: 'mapa', pathMatch: 'full' },
  { path: 'mapa',      component: MapaComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [adminGuard] },
  { path: 'sensor/:id', component: SensorDetailComponent, canActivate: [adminGuard] },
  { path: 'login',     component: LoginComponent },
  { path: 'register',  component: RegisterComponent },
  { path: '**',        redirectTo: 'mapa' },
];
>>>>>>> main
