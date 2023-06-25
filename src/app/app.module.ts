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

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    ListarduenosComponent,
    MascotasComponent,
    ConsultasComponent,
    LoginComponent,
    HistorialComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ElementosModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
