import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: any = null;
  activities: any[] = [];
  newActivityTitle = '';
  newActivityTopic = '';
  generatedDescription = '';

  private apiUrl = `http://${window.location.hostname}:3000/api`;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      this.router.navigate(['/login']);
      return;
    }
    this.user = JSON.parse(userStr);
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

  generateDescription() {
    if (!this.newActivityTopic) {
      alert('Por favor, ingresa el tema para que la IA genere la descripción.');
      return;
    }
    this.http.post<{description: string}>(`${this.apiUrl}/generate-description`, { topic: this.newActivityTopic }).subscribe({
      next: (res) => this.generatedDescription = res.description,
      error: (err) => alert('Error generando descripción con IA')
    });
  }

  createActivity() {
    if (!this.newActivityTitle || !this.generatedDescription) {
      alert('Necesitas un título y una descripción (generada) para crear la actividad.');
      return;
    }
    this.http.post(`${this.apiUrl}/activities`, { 
      title: this.newActivityTitle, 
      description: this.generatedDescription 
    }).subscribe({
      next: () => {
        alert('Actividad creada exitosamente');
        this.newActivityTitle = '';
        this.newActivityTopic = '';
        this.generatedDescription = '';
        this.loadActivities();
      },
      error: (err) => console.error(err)
    });
  }

  enroll(activityId: number) {
    this.http.post(`${this.apiUrl}/participantes`, { userId: this.user.id, activityId }).subscribe({
      next: () => alert('Inscrito exitosamente!'),
      error: (err) => console.error(err)
    });
  }
}