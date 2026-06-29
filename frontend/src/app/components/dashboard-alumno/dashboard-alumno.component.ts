import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-alumno',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-alumno.component.html'
})
export class DashboardAlumnoComponent implements OnInit {
  user: any = null;
  activities: any[] = [];
  myEnrollments: any[] = [];

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
    if (this.user.role !== 'Alumno') {
      this.router.navigate(['/admin']);
      return;
    }
    this.loadActivities();
    this.loadEnrollments();
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

  loadEnrollments() {
    this.http.get<any[]>(`${this.apiUrl}/users/${this.user.id}/enrollments`).subscribe({
      next: (data) => {
        this.myEnrollments = data.map(e => e.activity_id);
      },
      error: (err) => console.error('Error cargando inscripciones', err)
    });
  }

  isEnrolled(activityId: number): boolean {
    return this.myEnrollments.includes(activityId);
  }

  showToast(type: 'success' | 'error', message: string) {
    if (type === 'success') {
      this.successMessage = message;
    } else {
      this.errorMessage = message;
    }
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 4000);
  }

  enroll(activityId: number) {
    this.errorMessage = '';
    this.successMessage = '';
    this.http.post(`${this.apiUrl}/participantes`, { userId: this.user.id, activityId }).subscribe({
      next: () => {
        this.showToast('success', '¡Inscrito exitosamente!');
        this.myEnrollments.push(activityId); // Actualizar UI de inmediato
      },
      error: (err) => {
        const msg = err.error?.message === 'User already enrolled in this activity' 
          ? 'Ya estás inscrito en esta actividad.' 
          : 'Error al inscribirse';
        this.showToast('error', msg);
      }
    });
  }
}