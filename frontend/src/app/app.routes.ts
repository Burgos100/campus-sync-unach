import { Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component'; // Usando el login integrado con BD
import { DashboardComponent } from '../dashboard/dashboard.component'; // Usando el dashboard integrado con IA
import { DashboardAlumnoComponent } from './components/dashboard-alumno/dashboard-alumno.component';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'alumno', component: DashboardAlumnoComponent },
  { path: 'admin', component: DashboardAdminComponent }
];