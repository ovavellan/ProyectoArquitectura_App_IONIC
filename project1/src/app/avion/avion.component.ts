import { Component, OnInit } from '@angular/core';
import { ApiSpringService } from 'src/app/services/api-spring.service';

const uri_local: string = 'http://localhost:9005/aviones';

@Component({
  selector: 'app-avion',
  templateUrl: './avion.component.html',
  styleUrls: ['./avion.component.scss'],
})
export class AvionComponent implements OnInit {
  avionesLista: any[] = [];
  urlAvion: string = uri_local;

  displayedColumns: string[] = ['id', 'nombre_aeronave', 'company', 'capacidad_pasajeros', 'horas_vuelo'];

  constructor(private springService: ApiSpringService) { }

  ngOnInit(): void {
    this.getAviones();
  }

  getAviones() {
    this.springService.doGet(this.urlAvion).subscribe(
      (response: any[]) => {
        this.avionesLista = response;
      },
      (error) => {
        console.error('Error al obtener los aviones', error);
      }
    );
  }
}
