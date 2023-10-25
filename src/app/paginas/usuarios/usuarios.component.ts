import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { crearUsuario } from 'src/app/modelos/usuarios.model';
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
  showPasswordError = false;
  showNombresError = false;
  showapellidoPError = false;
  showapellidoMError = false;
  showcarnetError = false;
  showcelularError = false;
  showadireccionError = false;
  verCorreoError = false;
  verRolesError = false;
  buscarTexto: string = ''; // Propiedad para almacenar el texto de búsqueda
  noHayResultados: boolean = false;
  pagina: number = 1;
  constructor(
    private formBuilder: FormBuilder,

    private usuariosService: UsuariosService
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
      carnet: ['', [Validators.required, Validators.minLength(8)]],
      celular: ['',[Validators.required, Validators.minLength(7), Validators.maxLength(8)]],
      direccion: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['',[Validators.required,
                      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'),
                      ],
      ],
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
      const formData: any = new FormData();
      formData.append('carnet', this.formRegistrar.get('carnet')?.value);
      formData.append(
        'nombres',
        this.formRegistrar.get('primerNombreU')?.value
      );
      formData.append(
        'apellidoPaterno',
        this.formRegistrar.get('primerApellidoU')?.value
      );
      formData.append(
        'apellidoMaterno',
        this.formRegistrar.get('segundoApellidoU')?.value
      );
      formData.append('celular', this.formRegistrar.get('celular')?.value);
      formData.append('correo', this.formRegistrar.get('correo')?.value);
      formData.append('direccion', this.formRegistrar.get('direccion')?.value);
      formData.append('fotografia', this.formRegistrar.get('imagen')?.value);
      formData.append('idCuentaIdentity', 'a');

      let respuesta = await this.usuariosService.enviarCrearUsuarioService(
        this.formRegistrar.get('contrasena')?.value,
        this.formRegistrar.get('roles')?.value,
        formData
      );

      if ((respuesta.statusCode = 200)) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se registro usuario',
          showConfirmButton: true,
          timer: 1500,
        });
        this.obtenerUsuarios();
        this.resetForm();
        console.log(this.formRegistrar);
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Revise los datos.',
          showConfirmButton: true,
          timer: 1500,
        });
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
    this.verCorreoError = false;
    this.verRolesError = false;
  }
  async obtenerUsuarios() {
    try {
      // el back esta como quieres
      let respuesta = await this.usuariosService.listarUsuariosService(
        'usuarios'
      ); // mandar el servicio

      if ((respuesta.statusCode = 200)) {
        this.listaUsuarios = respuesta.datos;
        console.log(this.listaUsuarios);
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
        usuario.nombres.includes(this.buscarTexto)
      );
      this.noHayResultados = this.listaUsuarios.length === 0;
    }
  }
  abrirModalAsignarRol(usuario: any) {
    this.usuarioSeleccionado = usuario;
    this.formAsignarRol.patchValue({
      idUsuario: `${usuario.idCuentaIdentity}`,
    });
    // Aquí podrías abrir el modal
  }
  async asignarRol() {
    console.log(this.formAsignarRol.value);
    if (this.formAsignarRol.valid) {
      //  console.log( this.formAsignarRol.get('idUsuario')?.value+" ---"+this.formAsignarRol.get('rol')?.value);
      let respuesta = await this.usuariosService.asignarRol(
        this.formAsignarRol.get('idUsuario')?.value,
        this.formAsignarRol.get('rol')?.value
      );
      console.log(respuesta);
    } else {
      alert('Formulario Invalido');
      console.log(this.formAsignarRol.value);
    }
  }
}
