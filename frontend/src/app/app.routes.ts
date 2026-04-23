import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { MainLayoutComponent } from './layout/mainLayout/mainLayout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { authGuard } from './core/guards/authGuard';
import { JardinComponent } from './features/jardin/jardin.component';

export const routes: Routes = [
  {path:'login', component:LoginComponent},
  {
    path:'',
    component: MainLayoutComponent,
    canActivate:[authGuard],
    children:[
      { path:'dashboard',component:DashboardComponent},
      { path:'jardin',component:JardinComponent},
    ],
  },
  {
    path:'**',
    redirectTo:'dashboard'
  }
];
