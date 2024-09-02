import { Component, OnInit } from '@angular/core';
import {ApiSpringService} from "../services/api-spring.service";

const uri_local: string = 'http://localhost:9005/mecanicos';
@Component({
  selector: 'app-mecanico',
  templateUrl: './mecanico.component.html',
  styleUrls: ['./mecanico.component.scss'],
})
export class MecanicoComponent  implements OnInit {
  mecanicos: any = [];
  urlMecanico: string = uri_local;

  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'cedula', 'especialidad'];

  constructor(private springService: ApiSpringService) { }

  ngOnInit(): void {
    this.getMecanicos();
  }

  getMecanicos() {
    this.springService.doGet(this.urlMecanico).subscribe(
      (response: any[]) => {
        this.mecanicos = response;
      },
      (error) => {
        console.error('Error al obtener los mecánicos', error);
      }
    );
  }

}
