import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-admin.component.html'
})
export class DashboardAdminComponent implements OnInit {
  user: any = null;
  activities: any[] = [];
  participants: any[] = [];
  selectedActivity: any = null;
  metrics: any = null;

  newActivityTitle = '';
  newActivityTopic = '';
  generatedDescription = '';

  errorMessage = '';
  successMessage = '';

  private apiUrl = `http://${window.location.hostname}:3000/api`;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      this.router.navigate(['/login']);
      return;
    }
    this.user = JSON.parse(userStr);
    if (this.user.role !== 'Admin') {
      this.router.navigate(['/alumno']);
      return;
    }
    this.loadActivities();
    this.loadMetrics();
  }

  loadMetrics() {
    this.http.get<any>(`${this.apiUrl}/metrics`).subscribe({
      next: (data) => this.metrics = data,
      error: (err) => console.error('Error al cargar métricas', err)
    });
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  loadActivities() {
    this.http.get<any[]>(`${this.apiUrl}/activities`).subscribe({
      next: (data) => this.activities = data,
      error: (err) => console.error(err)
    });
  }

  generateDescription() {
    this.clearMessages();
    if (!this.newActivityTopic) {
      this.errorMessage = 'Ingresa el tema.';
      return;
    }
    this.http.post<{description: string}>(`${this.apiUrl}/generate-description`, { topic: this.newActivityTopic }).subscribe({
      next: (res) => this.generatedDescription = res.description,
      error: (err) => this.errorMessage = 'Error generando descripción con IA'
    });
  }

  createActivity() {
    this.clearMessages();
    if (!this.newActivityTitle || !this.generatedDescription) return;
    this.http.post(`${this.apiUrl}/activities`, { 
      title: this.newActivityTitle, description: this.generatedDescription 
    }).subscribe({
      next: () => {
        this.successMessage = 'Actividad creada exitosamente';
        this.newActivityTitle = '';
        this.newActivityTopic = '';
        this.generatedDescription = '';
        this.loadActivities();
      },
      error: (err) => this.errorMessage = 'Error al crear actividad'
    });
  }

  deleteActivity(id: number) {
    if(confirm('¿Seguro que deseas eliminar esta actividad?')) {
      this.http.delete(`${this.apiUrl}/activities/${id}`).subscribe({
        next: () => {
          this.successMessage = 'Actividad eliminada';
          this.loadActivities();
        },
        error: (err) => this.errorMessage = 'Error al eliminar'
      });
    }
  }

  viewParticipants(activity: any) {
    this.selectedActivity = activity;
    this.http.get<any[]>(`${this.apiUrl}/activities/${activity.id}/participantes`).subscribe({
      next: (data) => this.participants = data,
      error: (err) => console.error(err)
    });
  }

  toggleAttendance(enrollmentId: number, currentStatus: boolean) {
    this.http.put(`${this.apiUrl}/participantes/${enrollmentId}/asistencia`, { attended: !currentStatus }).subscribe({
      next: () => this.viewParticipants(this.selectedActivity),
      error: (err) => console.error(err)
    });
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }
}