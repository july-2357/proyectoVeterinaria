import { LoginService } from './../../services/login.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
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
  private autenticado = false;
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

      let respuesta = await this.loginService.enviarLoginService(loginEnviar);
      if (respuesta.token) {
        const tokenParts = respuesta.token.split('.');
        const decodedClaims = JSON.parse(atob(tokenParts[1]));
        this.cookieService.set('rol', decodedClaims.role, 1, '/');
        this.autenticado = true;
        localStorage.setItem('idLoginUsuario', decodedClaims.Id);
        this.router.navigate(['principal/inicio']);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          text: 'Bienvenido ' + decodedClaims.nombreUsuarioLogeado,
          showConfirmButton: false,
          width: '400px',
          timer: 1300,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'Datos incorrectos',
          width: '350px',
          showConfirmButton: false,
          timer: 1300,
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Debe llenar los campos para ingresar.',
        width: '350px',
        showConfirmButton: false,
        timer: 1300,
      });

      console.log(this.formIngresar);
    }
  }
  logout() {
    this.autenticado = false;
  }
  isAuthenticatedUser() {
    return this.autenticado;
  }
}
