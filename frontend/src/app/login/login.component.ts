import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  name = ''; // for registration

  // Detecta automáticamente si está en localhost o en AWS
  private apiUrl = `http://${window.location.hostname}:3000/api`;

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post(`${this.apiUrl}/users/login`, { email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        localStorage.setItem('user', JSON.stringify(res.user));
        if (res.user.role === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/alumno']);
        }
      },
      error: (err) => alert('Login fallido: ' + (err.error?.message || 'Error'))
    });
  }

  register() {
    if (!this.name) {
      alert('Por favor, ingresa tu nombre para registrarte.');
      return;
    }
    this.http.post(`${this.apiUrl}/users/register`, { name: this.name, email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
      },
      error: (err) => alert('Registro fallido: ' + (err.error?.message || 'Error'))
    });
  }
}