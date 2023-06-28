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
  constructor(private formBuilder: FormBuilder, private usuariosService:UsuariosService) {}
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
    });
  }
  ngOnInit(): void {
    this.construirFormulario();
  }
 async  guardar(){
    if(this.formRegistrar.valid){
      let usuarioEnviar:any={
        carnet:this.formRegistrar.get("carnet")?.value,
        nombres:this.formRegistrar.get("primerNombreU")?.value,
        apellidoPaterno: this.formRegistrar.get("primerApellidoU")?.value,
        apellidoMaterno: this.formRegistrar.get("segundoApellidoU")?.value,
        celular:this.formRegistrar.get("celular")?.value,
        correo: this.formRegistrar.get("correo")?.value,
        direccion: this.formRegistrar.get("direccion")?.value,
        idCuentaIdentity: "a"
      }
      let respuesta=await this.usuariosService.enviarCrearUsuarioService(this.formRegistrar.get("contrasena")?.value, usuarioEnviar)
      console.log(respuesta);

    }else{
      alert("Formulario Invalido");
      console.log(this.formRegistrar);
    }
  }
}
