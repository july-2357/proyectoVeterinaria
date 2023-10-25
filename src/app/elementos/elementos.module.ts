import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElementosRoutingModule } from './elementos-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { InputImgComponent } from './input-img/input-img.component';
import { GraficosComponent } from './graficos/graficos.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { CamaraComponent } from './camara/camara.component';

@NgModule({
  declarations: [SidebarComponent, HeaderComponent, FooterComponent, InputImgComponent, GraficosComponent, CalendarioComponent, CamaraComponent],
  imports: [CommonModule, ElementosRoutingModule],
  exports: [HeaderComponent, SidebarComponent,InputImgComponent,GraficosComponent,CamaraComponent],
})
export class ElementosModule {

}
