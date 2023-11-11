import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css'],
})
export class PerfilUsuarioComponent implements OnInit {
  datosUsuario: any;
  rolusuario: any;
  constructor(private usuariosSevice: UsuariosService) {}

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
        this.rolusuario = respuesta.base64;
        if ((respuesta.statusCode = 200)) {
          this.datosUsuario = respuesta.datos[0];
        }
      }
    } catch (error) {
      // en caso de error
      alert(JSON.stringify(error));
    }
  }
}
