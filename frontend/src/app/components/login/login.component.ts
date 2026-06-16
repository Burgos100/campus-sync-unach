import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isLoginMode = true;
  formData = {
    name: '',
    email: '',
    password: '',
    role: 'Alumno'
  };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  onSubmit() {
    if (this.isLoginMode) {
      this.authService.login({ email: this.formData.email, password: this.formData.password }).subscribe({
        next: (res) => {
          this.authService.setCurrentUser(res.user);
          this.redirectBasedOnRole(res.user.role);
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Error al iniciar sesión';
        }
      });
    } else {
      this.authService.register(this.formData).subscribe({
        next: (res) => {
          this.authService.setCurrentUser(res.user);
          this.redirectBasedOnRole(res.user.role);
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Error al registrarse';
        }
      });
    }
  }

  redirectBasedOnRole(role: string) {
    if (role === 'Admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/alumno']);
    }
  }
}
