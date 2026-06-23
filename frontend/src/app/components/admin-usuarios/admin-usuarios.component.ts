import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-usuarios.component.html',
  styleUrl: './admin-usuarios.component.scss'
})
export class AdminUsuariosComponent implements OnInit {
  usuarios: any[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.http.get<any[]>('http://localhost:3000/api/users')
      .subscribe({
        next: (data) => {
          this.usuarios = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar los usuarios.';
          this.loading = false;
          console.error(err);
        }
      });
  }
}
