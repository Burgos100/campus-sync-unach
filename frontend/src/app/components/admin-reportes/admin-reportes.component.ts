import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-reportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-reportes.component.html',
  styleUrl: './admin-reportes.component.scss'
})
export class AdminReportesComponent implements OnInit {
  reporteGenerado: string | null = null;
  loading: boolean = false;
  error: string | null = null;
  metrics: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>(`http://${window.location.hostname}:3000/api/metrics`).subscribe({
      next: (data) => this.metrics = data,
      error: (err) => console.error('Error al cargar métricas', err)
    });
  }

  generarReporte(): void {
    this.loading = true;
    this.error = null;
    this.reporteGenerado = null;

    this.http.get<{reporte: string}>(`http://${window.location.hostname}:3000/api/reportes/generar`)
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
