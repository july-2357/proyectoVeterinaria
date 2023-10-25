import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private cookieService:CookieService) { }

  ngOnInit(): void {
  }
  esRol(rol: string): boolean {
    const roles = this.cookieService.get('rol');
    return roles === rol;
  }

}
