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
  editingActivityId: number | null = null;

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

  showToast(type: 'success' | 'error', message: string) {
    if (type === 'success') {
      this.successMessage = message;
    } else {
      this.errorMessage = message;
    }
    setTimeout(() => {
      this.clearMessages();
    }, 4000);
  }

  generateDescription() {
    this.clearMessages();
    if (!this.newActivityTopic) {
      this.showToast('error', 'Ingresa el tema.');
      return;
    }
    this.http.post<{description: string}>(`${this.apiUrl}/generate-description`, { topic: this.newActivityTopic }).subscribe({
      next: (res) => this.generatedDescription = res.description,
      error: (err) => this.showToast('error', 'Error generando descripción con IA')
    });
  }

  createActivity() {
    this.clearMessages();
    if (!this.newActivityTitle || !this.generatedDescription) return;

    if (this.editingActivityId) {
      this.http.put(`${this.apiUrl}/activities/${this.editingActivityId}`, { 
        title: this.newActivityTitle, description: this.generatedDescription 
      }).subscribe({
        next: () => {
          this.showToast('success', 'Actividad actualizada exitosamente');
          this.resetForm();
          this.loadActivities();
        },
        error: (err) => this.showToast('error', 'Error al actualizar actividad')
      });
    } else {
      this.http.post(`${this.apiUrl}/activities`, { 
        title: this.newActivityTitle, description: this.generatedDescription 
      }).subscribe({
        next: () => {
          this.showToast('success', 'Actividad creada exitosamente');
          this.resetForm();
          this.loadActivities();
        },
        error: (err) => this.showToast('error', 'Error al crear actividad')
      });
    }
  }

  startEditActivity(activity: any) {
    this.editingActivityId = activity.id;
    this.newActivityTitle = activity.title;
    this.generatedDescription = activity.description;
    this.newActivityTopic = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {
    this.editingActivityId = null;
    this.newActivityTitle = '';
    this.newActivityTopic = '';
    this.generatedDescription = '';
  }

  deleteActivity(id: number) {
    if(confirm('¿Seguro que deseas eliminar esta actividad?')) {
      this.http.delete(`${this.apiUrl}/activities/${id}`).subscribe({
        next: () => {
          this.showToast('success', 'Actividad eliminada');
          this.loadActivities();
        },
        error: (err) => this.showToast('error', 'Error al eliminar')
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
