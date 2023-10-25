import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DuenosService } from 'src/app/services/duenos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.component.html',
  styleUrls: ['./correo.component.css']
})
export class CorreoComponent implements OnInit {
formEnviarCorreo:FormGroup;
  constructor(private formBuilder:FormBuilder, private duenosService:DuenosService) { }

  ngOnInit(): void {
    this.construirFormEnviarCorreo();
  }
  construirFormEnviarCorreo(){
    this.formEnviarCorreo = this.formBuilder.group({

      correoElectronico: ['', [Validators.required]],
      asuntoCorreo: ['', [Validators.required]],
      mensaje: ['', [Validators.required]]
    })
  }
  async enviarCorreo(){
    if (this.formEnviarCorreo.valid) {
      let correoEnviar: any = {
        correoDestinatrio: this.formEnviarCorreo.get('correoElectronico')?.value,
       asunto:this.formEnviarCorreo.get('asuntoCorreo')?.value,
       cuerpo:this.formEnviarCorreo.get('mensaje')?.value
      };
      console.log(correoEnviar);
      let respuesta = await this.duenosService.enviarCorreo(
        correoEnviar
      );
      if ((respuesta.statusCode = 200)) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se envio el correo',
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
      console.log(this.formEnviarCorreo.value);
    }

  }

}
