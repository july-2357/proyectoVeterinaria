import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { ListarduenosComponent } from './paginas/listarduenos/listarduenos.component';
import { MascotasComponent } from './paginas/mascotas/mascotas.component';
import { ConsultasComponent } from './paginas/consultas/consultas.component';
import { LoginComponent } from './paginas/login/login.component';
import { HistorialComponent } from './paginas/historial/historial.component';

const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' }, // Ruta predeterminada, redirige a /home
  { path: 'inicio', component: InicioComponent },
  { path: 'listarDuenos', component: ListarduenosComponent },
  { path: 'mascotas', component: MascotasComponent },
  { path: 'consultas', component: ConsultasComponent },
  { path: 'login', component: LoginComponent },
  { path: 'historial', component: HistorialComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
