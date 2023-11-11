import { ListaMascotasPdfComponent } from './reportes/lista-mascotas-pdf/lista-mascotas-pdf.component';
import { HistorialPdfComponent } from './reportes/historial-pdf/historial-pdf.component';
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
import { MostrarMascotasComponent } from './paginas/mostrar-mascotas/mostrar-mascotas.component';
import { PerfilUsuarioComponent } from './paginas/perfil-usuario/perfil-usuario.component';
import { PrimeraConsultaComponent } from './paginas/primera-consulta/primera-consulta.component';
import { DuenosPdfComponent } from './paginas/duenos-pdf/duenos-pdf.component';
import { RegistrarMascotasComponent } from './paginas/mascotas/registrar-mascotas/registrar-mascotas.component';
import { VigilanteGuard } from './guardianes/vigilante.guard';
import { CorreoComponent } from './paginas/recordatorios/correo/correo.component';
import { MascotasNotificacionesComponent } from './paginas/recordatorios/mascotas-notificaciones/mascotas-notificaciones.component';
import { EsLoginGuard } from './guardianes/es-login.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Ruta predeterminada, redirige a /home
  { path: 'login', canActivate:[EsLoginGuard],component: LoginComponent },

  {
    path: 'principal',

    canActivate:[VigilanteGuard],
    component: PrincipalComponent,
    children: [
      { path: 'inicio',canActivate:[VigilanteGuard], component: InicioComponent},
      { path: 'listarDuenos', canActivate:[VigilanteGuard],component: ListarduenosComponent  },
      {
        path: 'mascotas',canActivate:[VigilanteGuard],
        component: MascotasComponent,
      },
      { path: 'historial', canActivate:[VigilanteGuard],component: HistorialComponent },
      { path: 'mostrarMascotas',canActivate:[VigilanteGuard], component: MostrarMascotasComponent },
      { path: 'consultas',canActivate:[VigilanteGuard], component: ConsultasComponent },
      { path: 'usuarios',canActivate:[VigilanteGuard], component: UsuariosComponent },
      { path: 'perfilUsuario', canActivate:[VigilanteGuard],component: PerfilUsuarioComponent },
      { path: 'primeraConsulta', canActivate:[VigilanteGuard],component: PrimeraConsultaComponent },
      { path: 'duenos', canActivate:[VigilanteGuard],component: DuenosPdfComponent },
      { path: 'registromascota',canActivate:[VigilanteGuard], component: RegistrarMascotasComponent },
      { path: 'recordatorio',canActivate:[VigilanteGuard], component: MascotasNotificacionesComponent },
      { path: 'mascotasPDF',canActivate:[VigilanteGuard], component: ListaMascotasPdfComponent },

    ],

  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
