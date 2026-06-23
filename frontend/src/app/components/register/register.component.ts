import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  formData = {
    name: '',
    email: '',
    password: '',
    role: 'Alumno'
  };
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    this.authService.register(this.formData).subscribe({
      next: (res) => {
        this.successMessage = 'Registro exitoso';
        this.authService.setCurrentUser(res.user);
        this.redirectBasedOnRole(res.user.role);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Error al registrarse';
      }
    });
  }

  redirectBasedOnRole(role: string) {
    if (role === 'Admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/alumno']);
    }
  }
}
