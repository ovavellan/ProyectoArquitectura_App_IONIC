import { Component, OnInit } from '@angular/core';
import { ApiSpringService } from 'src/app/services/api-spring.service';

const uri_local: string = 'http://localhost:9005/pilotos';

@Component({
  selector: 'app-pilotos',
  templateUrl: './pilotos.component.html',
  styleUrls: ['./pilotos.component.scss'],
})
export class PilotosComponent implements OnInit {

  pilotos: any[] = [];
  urlPilotos: string = uri_local;

  displayedColumns: string[] = ['id', 'name', 'lastname', 'dni'];

  constructor(private springService: ApiSpringService) {}

  ngOnInit(): void {
    this.getPilotos();
  }

  getPilotos() {
    this.springService.doGet(this.urlPilotos).subscribe(
      (response: any[]) => {
        this.pilotos = response;
      },
      (error) => {
        console.error('Error al obtener los pilotos', error);
      }
    );
  }
}
