import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { ListarduenosComponent } from './paginas/listarduenos/listarduenos.component';
import { MascotasComponent } from './paginas/mascotas/mascotas.component';
import { ConsultasComponent } from './paginas/consultas/consultas.component';
import { LoginComponent } from './paginas/login/login.component';
import { HistorialComponent } from './paginas/historial/historial.component';
import { UsuariosComponent } from './paginas/usuarios/usuarios.component';
import { PrincipalComponent } from './paginas/principal/principal.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Ruta predeterminada, redirige a /home
  { path: 'login', component: LoginComponent },
  {
    path: 'principal',
    component: PrincipalComponent,
    children: [
      { path: 'inicio', component: InicioComponent },
      { path: 'listarDuenos', component: ListarduenosComponent },
      { path: 'mascotas', component: MascotasComponent, children: [] },
      { path: 'consultas', component: ConsultasComponent },
      { path: 'historial', component: HistorialComponent },
      { path: 'usuarios', component: UsuariosComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
