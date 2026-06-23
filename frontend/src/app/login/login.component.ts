import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  // Detecta automáticamente si está en localhost o en AWS
  private apiUrl = `http://${window.location.hostname}:3000/api`;

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.errorMessage = '';
    const cleanEmail = this.email ? this.email.trim().toLowerCase() : '';
    
    this.http.post(`${this.apiUrl}/users/login`, { email: cleanEmail, password: this.password }).subscribe({
      next: (res: any) => {
        localStorage.setItem('user', JSON.stringify(res.user));
        if (res.user.role === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/alumno']);
        }
      },
      error: (err) => {
        this.errorMessage = 'Login fallido: ' + (err.error?.message || 'Error');
      }
    });
  }
}