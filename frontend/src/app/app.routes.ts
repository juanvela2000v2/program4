import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';

export const routes: Routes = [
  {path:'login', component:LoginComponent},
  /*{
    path:'',
    component:'',
    canActivate:[],
    children:[
      { path:'dashboard',component:''}
    ],
  },*/
  {
    path:'**',
    redirectTo:'dashboard'
  }
];
