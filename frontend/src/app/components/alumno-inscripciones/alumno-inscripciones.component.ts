import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-alumno-inscripciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alumno-inscripciones.component.html',
  styleUrl: './alumno-inscripciones.component.scss'
})
export class AlumnoInscripcionesComponent implements OnInit {
  inscripciones: any[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.cargarInscripciones();
  }

  cargarInscripciones(): void {
    const user = this.authService.getCurrentUser();
    if (!user || !user.id) {
      this.error = 'No se pudo identificar al usuario.';
      this.loading = false;
      return;
    }

    this.http.get<any[]>(`http://${window.location.hostname}:3000/api/users/${user.id}/enrollments`)
      .subscribe({
        next: (data) => {
          this.inscripciones = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar las inscripciones.';
          this.loading = false;
          console.error(err);
        }
      });
  }
}
