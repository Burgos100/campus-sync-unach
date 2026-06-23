import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'; // Usando el login integrado con BD
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component'; // Usando el dashboard integrado con IA
import { DashboardAlumnoComponent } from './components/dashboard-alumno/dashboard-alumno.component';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';
import { AdminUsuariosComponent } from './components/admin-usuarios/admin-usuarios.component';
import { AdminReportesComponent } from './components/admin-reportes/admin-reportes.component';
import { AlumnoInscripcionesComponent } from './components/alumno-inscripciones/alumno-inscripciones.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { alumnoGuard } from './guards/alumno.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'alumno', component: DashboardAlumnoComponent, canActivate: [authGuard, alumnoGuard] },
  { path: 'alumno/mis-inscripciones', component: AlumnoInscripcionesComponent, canActivate: [authGuard, alumnoGuard] },
  { path: 'admin', component: DashboardAdminComponent, canActivate: [authGuard, adminGuard] },
  { path: 'admin/usuarios', component: AdminUsuariosComponent, canActivate: [authGuard, adminGuard] },
  { path: 'admin/reportes', component: AdminReportesComponent, canActivate: [authGuard, adminGuard] }
];