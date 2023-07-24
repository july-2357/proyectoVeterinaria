import { LoginService } from './../../services/login.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  formIngresar: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {}

  construirFormulario() {
    this.formIngresar = this.formBuilder.group({
      correo: ['', [Validators.required]],
      contrasena: ['', [Validators.required]],
    });
    console.log(this.formIngresar);
  }
  ngOnInit(): void {
    this.construirFormulario();
  }

  async ingresar() {
    if (this.formIngresar.valid) {
      let respuesta = await this.loginService.enviarLoginService(
        this.formIngresar.get('correo')?.value,
        this.formIngresar.get('contrasena')?.value
      );
      if (respuesta.token) {
        localStorage.setItem('token',respuesta.token);
        this.router.navigate(['principal/inicio']);

      }

      console.log(respuesta);
    } else {
      alert('Formulario Invalido');
      console.log(this.formIngresar);
    }
  }
}
