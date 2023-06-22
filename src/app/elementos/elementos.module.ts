import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElementosRoutingModule } from './elementos-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [SidebarComponent, HeaderComponent, FooterComponent],
  imports: [CommonModule, ElementosRoutingModule],
  exports: [HeaderComponent, SidebarComponent],
})
export class ElementosModule {}
