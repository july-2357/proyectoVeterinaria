import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  formRegistrar: FormGroup;
  formAsignarRol: FormGroup;
  usuarioSeleccionado: any;
  selectedFile: File | undefined;
  listaUsuarios: any = [];
  // Variables para mostrar los errores
  showPasswordError = false;
  showNombresError = false;
  showapellidoPError = false;
  showapellidoMError = false;
  showcarnetError = false;
  showcelularError = false;
  showadireccionError = false;
  showPassword2Error = false;
  verCorreoError = false;
  verRolesError = false;
  buscarTexto: string = '';
  noHayResultados: boolean = false;
  pagina: number = 1;
  constructor(
    private formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    private toastr: ToastrService
  ) {}
  construirFormularioAsignarRol() {
    this.formAsignarRol = this.formBuilder.group({
      idUsuario: [''],
      nombreUsuario: [''],
      rol: ['', []],
    });
  }
  construirFormulario() {
    this.formRegistrar = this.formBuilder.group({
      primerNombreU: ['', [Validators.required]],
      primerApellidoU: [
        '',
        [Validators.required, Validators.pattern('^[A-Za-z\\s]*$')],
      ],
      segundoApellidoU: ['', [Validators.pattern('^[A-Za-z\\s]*$')]],
      carnet: [
        '',
        [Validators.required, Validators.pattern('^[1-9][0-9]{6,7}$')],
      ],
      celular: ['', [Validators.required, Validators.pattern('^[0-9]{7,8}$')]],
      direccion: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: [
        '',
        [
          Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$'),
        ],
      ],
      contrasena2: ['', [Validators.required]],
      roles: ['', [Validators.required]],
      imagen: [''],
    });
  }
  ngOnInit(): void {
    this.construirFormulario();
    this.obtenerUsuarios();
    this.construirFormularioAsignarRol();
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }
  imagenCambiada = false;

  archivoSeleccionado(file: any) {
    this.imagenCambiada = true;
    this.formRegistrar.get('imagen')?.setValue(file);
  }
  async guardar() {
    if (this.formRegistrar.valid) {
      if (
        this.formRegistrar.get('contrasena')?.value ===
        this.formRegistrar.get('contrasena2')?.value
      ) {
        const formData: any = new FormData();
        formData.append('carnet', this.formRegistrar.get('carnet')?.value);
        formData.append(
          'nombres',
          this.formRegistrar.get('primerNombreU')?.value.toUpperCase()
        );
        formData.append(
          'apellidoPaterno',
          this.formRegistrar.get('primerApellidoU')?.value.toUpperCase()
        );
        formData.append(
          'apellidoMaterno',
          this.formRegistrar.get('segundoApellidoU')?.value.toUpperCase()
        );
        formData.append('celular', this.formRegistrar.get('celular')?.value);
        formData.append('correo', this.formRegistrar.get('correo')?.value);
        formData.append(
          'direccion',
          this.formRegistrar.get('direccion')?.value.toUpperCase()
        );
        formData.append('fotografia', this.formRegistrar.get('imagen')?.value);
        formData.append('idCuentaIdentity', 'a');
        let respuesta = await this.usuariosService.enviarCrearUsuarioService(
          this.formRegistrar.get('contrasena')?.value,
          this.formRegistrar.get('roles')?.value,
          formData
        );

        if (respuesta.statusCode === 200) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            text:
              'se registro al usuario ' +
              this.formRegistrar.get('primerNombreU')?.value.toUpperCase() +' '+
              this.formRegistrar.get('primerApellidoU')?.value.toUpperCase() +' '+
              this.formRegistrar.get('segundoApellidoU')?.value.toUpperCase(),
            showConfirmButton: false,
            width: '400px',
            timer: 1300,
          });
          this.obtenerUsuarios();
          this.resetForm();
        } else if (
          respuesta.statusCode === 400 &&
          respuesta.codigoRespuesta === 1002
        ) {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title:
              'El correo eléctronico ' +
              this.formRegistrar.get('correo')?.value +
              ' ya se encuentra registrado',
            showConfirmButton: true,
            timer: 1500,
          });
        }
      } else if (
        this.formRegistrar.get('contrasena')?.value !=
        this.formRegistrar.get('contrasena2')?.value
      ) {
        this.toastr.error(
          'Las contraseñas deben coincidir.',
          'Revise la contraseña!'
        );
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Revise los datos.',
        showConfirmButton: true,
        timer: 1500,
      });
    }
  }
  resetForm() {
    this.formRegistrar.reset(); // Restablece el formulario a su estado inicial
    this.formRegistrar.markAsPristine(); // Marca los campos como "pristine"
    console.log(this.formRegistrar);
    this.formRegistrar.markAsUntouched(); // Marca los campos como "untouched"
    this.showPasswordError = false;
    this.showNombresError = false;
    this.showapellidoPError = false;
    this.showapellidoMError = false;
    this.showcarnetError = false;
    this.showcelularError = false;
    this.showadireccionError = false;
    this.showPassword2Error = false;
    this.verCorreoError = false;
    this.verRolesError = false;
  }
  async obtenerUsuarios() {
    try {
      let respuesta = await this.usuariosService.listarUsuariosService(
        'usuarios'
      );

      if (respuesta.statusCode === 200) {
        this.listaUsuarios = respuesta.datos;
      }
    } catch (error) {
      alert(JSON.stringify(error));
    }
  }
  buscarUsuario() {
    if (!this.buscarTexto) {
      this.noHayResultados = false;
      this.obtenerUsuarios();
    } else {
      // Filtrar la lista de usuarios según el texto de búsqueda
      this.listaUsuarios = this.listaUsuarios.filter((usuario: any) =>
        usuario.nombres.toLowerCase().includes(this.buscarTexto)
      );
      this.noHayResultados = this.listaUsuarios.length === 0;
    }
  }
  // Para los roles
  abrirModalAsignarRol(usuario: any) {
    this.usuarioSeleccionado = usuario;
    this.formAsignarRol.patchValue({
      idUsuario: `${usuario.idCuentaIdentity}`,
      nombreUsuario:
        usuario.nombres +
        ' ' +
        usuario.apellidoPaterno +
        ' ' +
        usuario.apellidoMaterno,
    });
    // Aquí podrías abrir el modal
  }
  async asignarRol() {
    if (this.formAsignarRol.valid) {
      let respuesta = await this.usuariosService.asignarRol(
        this.formAsignarRol.get('idUsuario')?.value,
        this.formAsignarRol.get('rol')?.value
      );
      if (respuesta.statusCode === 200) {
        this.toastr.info(
          '',
          'Se asigno el rol al usuario'
        );
      }
    } else {
      alert('Formulario Invalido');
      console.log(this.formAsignarRol.value);
    }
  }
}
