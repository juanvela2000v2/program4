import { Routes } from '@angular/router'
import { LoginComponent } from './features/auth/login/login.component'
import { RegistroComponent } from './features/auth/registro/registro.component'
import { InicioUsuarioComponent } from './features/usuario/inicio-usuario/inicio-usuario.component'
import { CitaMedicaComponent } from './features/usuario/cita-medica/cita-medica.component'
import { CitaEnfermeriaComponent } from './features/usuario/cita-enfermeria/cita-enfermeria.component'
import { FilaVirtualComponent } from './features/usuario/fila-virtual/fila-virtual.component'
import { PagarComponent } from './features/usuario/pagar/pagar.component'
import { AdminDashboardComponent } from './features/admin/dashboard/dashboard.component'
import { AdminUsuariosComponent } from './features/admin/usuarios/usuarios.component'
import { AdminMedicosComponent } from './features/admin/medicos/medicos.component'
import { AdminEspecialidadesComponent } from './features/admin/especialidades/especialidades.component'
import { AdminAlmacenComponent } from './features/admin/almacen/almacen.component'
import { EnfermeraInicioComponent } from './features/enfermera/inicio/inicio.component'
import { EnfermeraFilaComponent } from './features/enfermera/fila/fila.component'
import { EnfermeraAlmacenComponent } from './features/enfermera/almacen/almacen.component'
import { AdminLayoutComponent } from './features/admin/admin-layout/admin-layout.component'
import { roleGuard } from './core/guards/role.guard'
import { enfermeraGuard } from './core/guards/enfermera.guard'
import { EnfermeraLayoutComponent } from './features/enfermera/enfermera-layout/enfermera-layout.component'
import { MedicoLayoutComponent } from './features/medico/medico-layout/medico-layout.component'
import { MedicoInicioComponent } from './features/medico/inicio/inicio.component'
import { MedicoFilaComponent } from './features/medico/fila/fila.component'
import { MedicoDiagnosticoComponent } from './features/medico/diagnostico/diagnostico.component'
import { MedicoRecetaComponent } from './features/medico/receta/receta.component'
import { MedicoHistorialComponent } from './features/medico/historial/historial.component'
import { medicoGuard } from './core/guards/medico.guard'
import { AdminEnfermerasComponent } from './features/admin/enfermeras/enfermeras.component'
import { FilaPublicaComponent } from './features/fila-publica/fila-publica.component'
import { UsuarioLayoutComponent } from './features/usuario/usuario-layout/usuario-layout.component'
import { HorariosDoctoresComponent } from './features/admin/usuarios/horarios-doctores.component/horarios-doctores.component'
export const routes: Routes = [
    // Rutas públicas
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'fila-publica', component: FilaPublicaComponent },
    // Rutas de usuario (sin guard, acceso libre después de login)
    {
        path: 'usuario',
        component: UsuarioLayoutComponent, 
        children: [
            
            { path: '', component: InicioUsuarioComponent },
            { path: 'cita-medica', component: CitaMedicaComponent },
            { path: 'cita-enfermeria', component: CitaEnfermeriaComponent },
            { path: 'fila-virtual', component: FilaPublicaComponent },
            { path: 'pagar/:token', component: PagarComponent }
            ,{ path: 'medicos', component: AdminMedicosComponent },
            { path: 'horarios', component: HorariosDoctoresComponent },
{ path: 'enfermeras', component: AdminEnfermerasComponent }
        ]
    },

    // Rutas de administrador (protegidas por roleGuard)
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [roleGuard],
        children: [
            { path: '', component: AdminDashboardComponent },
            { path: 'usuarios', component: AdminUsuariosComponent },
            { path: 'medicos', component: AdminMedicosComponent },
            { path: 'especialidades', component: AdminEspecialidadesComponent },
            { path: 'almacen', component: AdminAlmacenComponent },
            { path: 'enfermeras', component: AdminEnfermerasComponent }
        ]
    },

    // Rutas de enfermera (protegidas por enfermeraGuard)
    {
        path: 'enfermera',
        component: EnfermeraLayoutComponent,
        canActivate: [enfermeraGuard],
        children: [
            { path: '', component: EnfermeraInicioComponent },
            { path: 'fila', component: EnfermeraFilaComponent },
            { path: 'almacen', component: EnfermeraAlmacenComponent }
        ]
    },
    {
    path: 'medico',
    component: MedicoLayoutComponent,
    canActivate: [medicoGuard],
    children: [
        { path: '', component: MedicoInicioComponent },
        { path: 'fila', component: MedicoFilaComponent },
        { path: 'diagnostico', component: MedicoDiagnosticoComponent },
        { path: 'receta', component: MedicoRecetaComponent },
        { path: 'historial', component: MedicoHistorialComponent }
    ]
},

    // Redirección por defecto
    { path: '**', redirectTo: 'login' }
]