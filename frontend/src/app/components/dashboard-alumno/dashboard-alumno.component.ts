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

  private apiUrl = 'http://localhost:3000/api';

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

  enroll(activityId: number) {
    this.http.post(`${this.apiUrl}/participantes`, { userId: this.user.id, activityId }).subscribe({
      next: () => {
        alert('¡Inscrito exitosamente!');
      },
      error: (err) => alert(err.error?.message || 'Error al inscribirse')
    });
  }
}