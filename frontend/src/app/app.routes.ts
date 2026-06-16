import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardAlumnoComponent } from './components/dashboard-alumno/dashboard-alumno.component';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'alumno', component: DashboardAlumnoComponent },
    { path: 'admin', component: DashboardAdminComponent }
];
