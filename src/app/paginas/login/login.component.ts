import { LoginService } from './../../services/login.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  formIngresar: FormGroup;
  isLoggin$: Observable<boolean>;
  private isAuthenticated = false;
  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private cookieService: CookieService
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
      let loginEnviar: any = {
        email: this.formIngresar.get('correo')?.value,
        password: this.formIngresar.get('contrasena')?.value,
      };

      console.log(this.formIngresar.value);
      console.log('--------------');
      let respuesta = await this.loginService.enviarLoginService(loginEnviar);
      console.log('--------------');
      console.log(respuesta);
      if (respuesta.token) {
        var token = respuesta.token;
        const tokenParts = respuesta.token.split('.');
        const decodedClaims = JSON.parse(atob(tokenParts[1]));
        this.cookieService.set('rol', decodedClaims.role, 1, '/');
        this.isAuthenticated = true;
        localStorage.setItem('idLoginUsuario', decodedClaims.Id);
        console.log('el rol es: ' + decodedClaims.role);
        this.router.navigate(['principal/inicio']);
      }
    } else {
      // alert('Formulario Invalido');
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Debe llenar los campos para ingresar.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Cerrar',
      });

      console.log(this.formIngresar);
    }
  }
  logout() {
    // Realizar la lógica de cierre de sesión aquí, como limpiar tokens o datos de usuario
    this.isAuthenticated = false;
  }
  isAuthenticatedUser() {
    return this.isAuthenticated;
  }
}
