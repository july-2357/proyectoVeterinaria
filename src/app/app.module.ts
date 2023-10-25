import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ElementosModule } from './elementos/elementos.module';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { ListarduenosComponent } from './paginas/listarduenos/listarduenos.component';
import { MascotasComponent } from './paginas/mascotas/mascotas.component';
import { ConsultasComponent } from './paginas/consultas/consultas.component';
import { LoginComponent } from './paginas/login/login.component';
import { HistorialComponent } from './paginas/historial/historial.component';
import { UsuariosComponent } from './paginas/usuarios/usuarios.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PrincipalComponent } from './paginas/principal/principal.component';
import { MostrarMascotasComponent } from './paginas/mostrar-mascotas/mostrar-mascotas.component';
import { PerfilUsuarioComponent } from './paginas/perfil-usuario/perfil-usuario.component';
import { ErrorTailorModule } from '@ngneat/error-tailor';
import { config } from 'rxjs';
import { PrimeraConsultaComponent } from './paginas/primera-consulta/primera-consulta.component';
import { DuenosPdfComponent } from './paginas/duenos-pdf/duenos-pdf.component';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { RegistrarMascotasComponent } from './paginas/mascotas/registrar-mascotas/registrar-mascotas.component';
import { HistorialPdfComponent } from './reportes/historial-pdf/historial-pdf.component';
import { ListaMascotasPdfComponent } from './reportes/lista-mascotas-pdf/lista-mascotas-pdf.component';
import { NgxPaginationModule } from 'ngx-pagination';
import {Chart} from 'chart.js';
import { registerables } from 'chart.js';
Chart.register(...registerables);
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { ActualizarMascotaComponent } from './paginas/mascotas/actualizar-mascota/actualizar-mascota.component';
import { ListaDuenosComponent } from './reportes/lista-duenos/lista-duenos.component';
import { CorreoComponent } from './paginas/recordatorios/correo/correo.component';
import { RecordatorioComponent } from './paginas/recordatorios/recordatorio/recordatorio.component';
import { MascotasNotificacionesComponent } from './paginas/recordatorios/mascotas-notificaciones/mascotas-notificaciones.component'; // Importa CookieService desde ngx-cookie-service
import { CamaraComponent } from './elementos/camara/camara.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    ListarduenosComponent,
    MascotasComponent,
    ConsultasComponent,
    LoginComponent,
    HistorialComponent,
    UsuariosComponent,
    PrincipalComponent,
    MostrarMascotasComponent,
    PerfilUsuarioComponent,
    PrimeraConsultaComponent,
    DuenosPdfComponent,
    ErrorMessageComponent,
    RegistrarMascotasComponent,
    HistorialPdfComponent,
    ListaMascotasPdfComponent,
    ActualizarMascotaComponent,
    ListaDuenosComponent,
    CorreoComponent,
    RecordatorioComponent,
    MascotasNotificacionesComponent,
    SafeHtmlPipe,

  ],
  imports: [

    BrowserModule,
    CommonModule,
    AppRoutingModule,
    ElementosModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    ErrorTailorModule.forRoot({
      errors: {
        useValue: {
          required: '',
          minlength: ({ requiredLength, actualLength }) =>
            `Expect ${requiredLength} but got ${actualLength}`,
          invalidAddress: (error) => `Address isn't valid`,
        },
      },
    }),
  ],
  providers: [DatePipe, CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}
