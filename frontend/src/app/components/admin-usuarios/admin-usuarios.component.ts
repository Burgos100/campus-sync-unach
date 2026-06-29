import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-usuarios.component.html',
  styleUrl: './admin-usuarios.component.scss'
})
export class AdminUsuariosComponent implements OnInit {
  usuarios: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  private apiUrl = `http://${window.location.hostname}:3000/api`;

  editingUserId: number | null = null;
  editName: string = '';
  editEmail: string = '';

  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  showToast(type: 'success' | 'error', message: string) {
    if (type === 'success') {
      this.successMessage = message;
    } else {
      this.errorMessage = message;
    }
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 4000);
  }

  cargarUsuarios(): void {
    this.http.get<any[]>(`${this.apiUrl}/users`)
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

  cambiarRol(user: any): void {
    const newRole = user.role === 'Admin' ? 'Alumno' : 'Admin';
    if(confirm(`¿Estás seguro de cambiar el rol de ${user.name} a ${newRole}?`)) {
      this.http.put(`${this.apiUrl}/users/${user.id}/role`, { role: newRole }).subscribe({
        next: () => {
          user.role = newRole;
          this.showToast('success', `Rol cambiado a ${newRole}`);
        },
        error: (err) => {
          this.showToast('error', 'Error al cambiar el rol');
          console.error(err);
        }
      });
    }
  }

  iniciarEdicion(user: any): void {
    this.editingUserId = user.id;
    this.editName = user.name;
    this.editEmail = user.email;
  }

  cancelarEdicion(): void {
    this.editingUserId = null;
    this.editName = '';
    this.editEmail = '';
  }

  guardarEdicion(user: any): void {
    if (!this.editName || !this.editEmail) return;

    this.http.put(`${this.apiUrl}/users/${user.id}`, { name: this.editName, email: this.editEmail }).subscribe({
      next: () => {
        user.name = this.editName;
        user.email = this.editEmail;
        this.editingUserId = null;
        this.showToast('success', 'Usuario actualizado');
      },
      error: (err) => {
        this.showToast('error', 'Error al actualizar usuario');
        console.error(err);
      }
    });
  }

  eliminarUsuario(user: any): void {
    if(confirm(`¿Estás COMPLETAMENTE seguro de eliminar al usuario ${user.name}? Esta acción no se puede deshacer.`)) {
      this.http.delete(`${this.apiUrl}/users/${user.id}`).subscribe({
        next: () => {
          this.usuarios = this.usuarios.filter(u => u.id !== user.id);
          this.showToast('success', 'Usuario eliminado');
        },
        error: (err) => {
          this.showToast('error', 'Error al eliminar usuario');
          console.error(err);
        }
      });
    }
  }
}
