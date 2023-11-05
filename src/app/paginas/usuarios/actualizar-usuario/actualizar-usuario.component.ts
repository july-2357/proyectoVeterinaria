import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-actualizar-usuario',
  templateUrl: './actualizar-usuario.component.html',
  styleUrls: ['./actualizar-usuario.component.css'],
})
export class ActualizarUsuarioComponent implements OnInit {
  formActualizarUsuario: FormGroup;
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
              [Validators.required, Validators.minLength(8)],
            ],
            celular: [
              datosAntiguosUsuario.celular,
              [
                Validators.required,
                Validators.minLength(7),
                Validators.maxLength(8),
              ],
            ],
            direccion: [datosAntiguosUsuario.direccion, [Validators.required]],
            correo: [
              datosAntiguosUsuario.correo,
              [Validators.required, Validators.email],
            ],
          });
        } else {
          // Manejo de errores si la respuesta no es 200
        }
      } catch (error) {
        console.error('Error al obtener datos de usuario', error);
        // Manejo de errores
      }
    }
  }

  ngOnInit(): void {
    this.construirFormularioActualizarUsuario();
  }

  async actualizarUsuario() {
    if (this.formActualizarUsuario.valid) {
      let usuario: any = {
        nombres: this.formActualizarUsuario.get('primerNombreU')?.value.toUpperCase(),
        apellidoPaterno: this.formActualizarUsuario.get('primerApellidoU')?.value.toUpperCase(),
        apellidoMaterno: this.formActualizarUsuario.get('segundoApellidoU')?.value.toUpperCase(),
        carnet: this.formActualizarUsuario.get('carnet')?.value.toUpperCase(),
        celular: this.formActualizarUsuario.get('celular')?.value.toUpperCase(),
        correo: this.formActualizarUsuario.get('correo')?.value.toUpperCase(),
        direccion: this.formActualizarUsuario.get('direccion')?.value.toUpperCase(),
        idCuentaIdentity: localStorage.getItem('idLoginUsuario'),
        fotografia:''
      };
      console.log(usuario);
      // let respuesta = await this.mascotasService.enviarCrearMascota(
      //   mascotaEnviar
      // );
      // if ((respuesta.statusCode = 200)) {
      //   Swal.fire({
      //     position: 'center',
      //     icon: 'success',
      //     title: 'Se registro la mascota',
      //     showConfirmButton: true,
      //     timer: 1500,
      //   });
      //   this.obtenerMascotas();
      //   this.resetForm();
      // } else {
      //   Swal.fire({
      //     position: 'center',
      //     icon: 'error',
      //     title: 'Verifique los datos.',
      //     showConfirmButton: true,
      //     timer: 1500,
      //   });
      // }
    } else {
      alert('Formulario Invalido');
      console.log(this.formActualizarUsuario.value);
    }

  }
}
