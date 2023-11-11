import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { InicioSesionService } from 'src/app/services/inicio-sesion.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  datosUsuario: any;
  constructor(private usuariosSevice: UsuariosService, private auth: InicioSesionService, private router:Router) {}

  ngOnInit(): void {
    this.mostrarPerfil();
  }

  async mostrarPerfil() {
    try {
      // el back esta como quieres

      let usuario = localStorage.getItem('idLoginUsuario');
      if (usuario !== null) {
        usuario = usuario.toString();
        let respuesta = await this.usuariosSevice.listarUsuariosService(
          usuario
        ); // mandar el servicio

        if ((respuesta.statusCode = 200)) {
          this.datosUsuario = respuesta.datos[0];
        }
      }
    } catch (error) {
      // en caso de error
      alert(JSON.stringify(error));
    }
  }
  logout() {
    this.auth.logout();
    // Redirigir al usuario a la página de inicio de sesión o a la página pública
    localStorage.clear();
    this.router.navigate(['/login']);

  }
}
