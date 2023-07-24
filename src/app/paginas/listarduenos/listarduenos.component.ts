import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { DuenosService } from 'src/app/services/duenos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-listarduenos',
  templateUrl: './listarduenos.component.html',
  styleUrls: ['./listarduenos.component.css'],
})
export class ListarduenosComponent implements OnInit {
  formRegistrarDueno: FormGroup;
  listaDuenos: any=[];                               //   Variable global para guardar la inf
  constructor(
    private formBuilder: FormBuilder,
    private duenosService: DuenosService
  ) {}

  construirFormulario() {
    this.formRegistrarDueno = new FormGroup({
      nombreD: new FormControl('', Validators.required),
      apellidoPD: new FormControl('', Validators.required),
      apellidoMD: new FormControl('', Validators.required),
      celularD: new FormControl('', Validators.required),
      direccionD: new FormControl('', Validators.required),
      correoD: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.construirFormulario();
    this.obtenerDuenos();
  }
  async guardarDueno() {
    if (this.formRegistrarDueno.valid) {
      console.log(this.formRegistrarDueno.value);

      let usuarioEnviar: any = {
        nombres: this.formRegistrarDueno.get('nombreD')?.value,
        apellidoPaterno: this.formRegistrarDueno.get('apellidoPD')?.value,
        apellidoMaterno: this.formRegistrarDueno.get('apellidoMD')?.value,
        telefono: this.formRegistrarDueno.get('celularD')?.value,
        correo: this.formRegistrarDueno.get('correoD')?.value,
        direccion: this.formRegistrarDueno.get('direccionD')?.value,
      };
      let respuesta = await this.duenosService.enviarCrearDuenoService(
        usuarioEnviar
      );
      console.log(respuesta);
    } else {
      alert('Formulario Invalido');
      console.log(this.formRegistrarDueno);
    }
  }
  async obtenerDuenos() {

    try {                                                             // el back esta como quieres
      let respuesta = await this.duenosService.listarDuenosService(); // mandar el servicio

      if(respuesta.statusCode=200){
        this.listaDuenos=respuesta.datos;
        console.log(this.listaDuenos);
      }
    } catch (error) {                                                 // en caso de error
      alert(JSON.stringify(error));
    }
  }
}
