import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-usuario',
  templateUrl: './actualizar-usuario.component.html',
  styleUrls: ['./actualizar-usuario.component.css'],
})
export class ActualizarUsuarioComponent implements OnInit {
  formActualizarUsuario: FormGroup;
  idUsuario: any;
  // Variables para los errores
  showPasswordError = false;
  showNombresError = false;
  showapellidoPError = false;
  showapellidoMError = false;
  showcarnetError = false;
  showcelularError = false;
  showadireccionError = false;
  verCorreoError = false;
  verRolesError = false;
  constructor(
    private formBuilder: FormBuilder,
    private usuariosSevice: UsuariosService
  ) {}

  async construirFormularioActualizarUsuario() {
    const idUsuario = localStorage.getItem('idLoginUsuario');
    let datosAntiguosUsuario: any;
    if (idUsuario !== null) {
      try {
        let respuesta = await this.usuariosSevice.listarUsuariosService(
          idUsuario
        );
        if (respuesta.statusCode === 200) {
          datosAntiguosUsuario = respuesta.datos[0];
          this.formActualizarUsuario = this.formBuilder.group({
            primerNombreU: [
              datosAntiguosUsuario.nombres,
              [Validators.required],
            ],
            primerApellidoU: [
              datosAntiguosUsuario.apellidoPaterno,
              [Validators.required, Validators.pattern('^[A-Za-z\\s]*$')],
            ],
            segundoApellidoU: [
              datosAntiguosUsuario.apellidoMaterno,
              [Validators.pattern('^[A-Za-z\\s]*$')],
            ],
            carnet: [
              datosAntiguosUsuario.carnet,
              [Validators.required, Validators.pattern('^[1-9][0-9]*$')],
            ],
            celular: [
              datosAntiguosUsuario.celular,
              [
                Validators.required,
                Validators.pattern('^[0-9]{7,8}$'),
              ],
            ],
            direccion: [datosAntiguosUsuario.direccion, [Validators.required]],
          });
        }
      } catch (error) {
        console.error('Error al obtener datos de usuario', error);
      }
    }
  }
  ngOnInit(): void {
    this.construirFormularioActualizarUsuario();
    if (localStorage.getItem('idLoginUsuario')) {
      this.idUsuario = localStorage.getItem('idLoginUsuario');
    }
  }

  async actualizarUsuario() {
    if (this.formActualizarUsuario.valid) {
      let usuario: any = {
        nombres: this.formActualizarUsuario
          .get('primerNombreU')
          ?.value.toUpperCase(),
        apellidoPaterno: this.formActualizarUsuario
          .get('primerApellidoU')
          ?.value.toUpperCase(),
        apellidoMaterno: this.formActualizarUsuario
          .get('segundoApellidoU')
          ?.value.toUpperCase(),
        carnet: this.formActualizarUsuario.get('carnet')?.value.toUpperCase(),
        celular: this.formActualizarUsuario.get('celular')?.value,
        correo: 'correo@gmail.com',
        direccion: this.formActualizarUsuario
          .get('direccion')
          ?.value.toUpperCase(),
        idCuentaIdentity: localStorage.getItem('idLoginUsuario'),
        fotografia: null,
      };

      let respuesta = await this.usuariosSevice.ActualizarDatosUsuarioService(
        this.idUsuario,
        false,
        'opcional',
        usuario
      );
      if (respuesta.statusCode === 200) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se actualizaron los datos del usuario',
          showConfirmButton: true,
          timer: 1500,
        });
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Verifique los datos.',
          showConfirmButton: true,
          timer: 1500,
        });
      }
    } else {
      alert('Formulario Invalido');
    }
  }
}
