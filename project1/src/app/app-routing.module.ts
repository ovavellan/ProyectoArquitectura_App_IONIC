import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import {PilotosComponent} from "./pilotos/pilotos.component";
import {AvionComponent} from "./avion/avion.component";
import {MecanicoComponent} from "./mecanico/mecanico.component"; // Importación ya hecha

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'estadisticas',  // Nueva ruta para el componente Dashboard
    component: DashboardComponent
  },
  {
    path: 'pilotos',  // Nueva ruta para el componente Dashboard
    component: PilotosComponent
  },
  {
    path: 'aviones',  // Nueva ruta para el componente Dashboard
    component: AvionComponent
  },
  {
    path: 'mecanicos',  // Nueva ruta para el componente Dashboard
    component: MecanicoComponent
  },
  {
    path: '',
    redirectTo: 'estadisticas',  // Cambia a 'dashboard' si quieres que sea la ruta predeterminada
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
