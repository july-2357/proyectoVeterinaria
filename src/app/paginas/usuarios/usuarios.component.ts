import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { crearUsuario } from 'src/app/modelos/usuarios.model';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  formRegistrar: FormGroup;
  selectedFile: File | undefined;
  constructor(
    private formBuilder: FormBuilder,
    private usuariosService: UsuariosService
  ) {}
  construirFormulario() {
    this.formRegistrar = this.formBuilder.group({
      primerNombreU: ['', [Validators.required]],
      primerApellidoU: ['', [Validators.required]],
      segundoApellidoU: ['', []],
      carnet: ['', [Validators.required]],
      celular: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required]],
      roles: ['', [Validators.required]],
      imagen: [''],
    });
  }
  ngOnInit(): void {
    this.construirFormulario();
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }
  imagenCambiada = false;

  archivoSeleccionado(file:any){
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

      // let usuarioEnviar:crearUsuario={
      //   carnet:this.formRegistrar.get("carnet")?.value,
      //   nombres:this.formRegistrar.get("primerNombreU")?.value,
      //   apellidoPaterno: this.formRegistrar.get("primerApellidoU")?.value,
      //   apellidoMaterno: this.formRegistrar.get("segundoApellidoU")?.value,
      //   celular:this.formRegistrar.get("celular")?.value,
      //   correo: this.formRegistrar.get("correo")?.value,
      //   direccion: this.formRegistrar.get("direccion")?.value,
      //   idCuentaIdentity: "a"
      // }
      let respuesta = await this.usuariosService.enviarCrearUsuarioService(
        this.formRegistrar.get('contrasena')?.value,
        this.formRegistrar.get('roles')?.value,
        formData
      );
      console.log(respuesta);
      console.log(this.formRegistrar);
    } else {
      alert('Formulario Invalido');
      console.log(this.formRegistrar);
    }
  }
}
