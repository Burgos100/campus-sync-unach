import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-reportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-reportes.component.html',
  styleUrl: './admin-reportes.component.scss'
})
export class AdminReportesComponent {
  reporteGenerado: string | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  generarReporte(): void {
    this.loading = true;
    this.error = null;
    this.reporteGenerado = null;

    this.http.get<{reporte: string}>('http://localhost:3000/api/reportes/generar')
      .subscribe({
        next: (data) => {
          this.reporteGenerado = data.reporte;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al generar el reporte con IA.';
          this.loading = false;
          console.error(err);
        }
      });
  }
}
