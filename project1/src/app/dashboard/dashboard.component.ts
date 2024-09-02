import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  plotUrl1: string | null = null;
  plotUrl2: string | null = null;
  plotUrl3: string | null = null;
  year1: number | null = null;
  year2: number | null = null;
  year3: number | null = null;
  month: number | null = null;

  private apiUrl = 'http://localhost:9005/graficos'; // Asegúrate de que esta URL sea correcta

  constructor(private http: HttpClient) { }

  ngOnInit(): void { }

  fetchKPI1(): void {
    const year = Number(this.year1);
    console.log('Valor de year1:', this.year1); // Agregado para depuración
    console.log('Valor convertido de year1:', year); // Agregado para depuración

    if (!year || isNaN(year)) {
      alert('Por favor ingrese un año válido para el gráfico 1.');
      return;
    }

    const url = `${this.apiUrl}?year=${year}`;

    this.http.get<any>(url).subscribe(
      data => {
        console.log('Datos del gráfico 1:', data);
        this.plotUrl1 = 'data:image/png;base64,' + data.plot_url1;
      },
      error => {
        console.error('Error al obtener el gráfico 1:', error);
      }
    );
  }

  fetchKPI2(): void {
    const year = Number(this.year2);
    console.log('Valor de year2:', this.year2); // Agregado para depuración
    console.log('Valor convertido de year2:', year); // Agregado para depuración

    if (!year || isNaN(year)) {
      alert('Por favor ingrese un año válido para el gráfico 2.');
      return;
    }

    let url = `${this.apiUrl}?year=${year}`;
    if (this.month !== null) {
      url += `&month=${this.month}`;
    }

    this.http.get<any>(url).subscribe(
      data => {
        console.log('Datos del gráfico 2:', data);
        this.plotUrl2 = 'data:image/png;base64,' + data.plot_url2;
      },
      error => {
        console.error('Error al obtener el gráfico 2:', error);
      }
    );
  }

  fetchKPI3(): void {
    const year = Number(this.year3);
    console.log('Valor de year3:', this.year3); // Agregado para depuración
    console.log('Valor convertido de year3:', year); // Agregado para depuración

    if (!year || isNaN(year)) {
      alert('Por favor ingrese un año válido para el gráfico 3.');
      return;
    }

    const url = `${this.apiUrl}?year=${year}`;

    this.http.get<any>(url).subscribe(
      data => {
        console.log('Datos del gráfico 3:', data);
        this.plotUrl3 = 'data:image/png;base64,' + data.plot_url3;
      },
      error => {
        console.error('Error al obtener el gráfico 3:', error);
      }
    );
  }
}
