import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DuenosService } from 'src/app/services/duenos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listarduenos',
  templateUrl: './listarduenos.component.html',
  styleUrls: ['./listarduenos.component.css'],
})
export class ListarduenosComponent implements OnInit {
  formRegistrarDueno: FormGroup;
  verNombreError = false;
  verApellidoPError = false;
  verApellidoMError = false;
  verCelularError = false;
  verDireccionError = false;
  verCorreoError = false;
  buscarTexto: string = '';
  listaDuenos: any = []; //   Variable global para guardar la inf
  p: number = 1;
  textoEnMayusculas: string = '';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private duenosService: DuenosService,
    private cookieService: CookieService,
    private toastr: ToastrService
  ) {}

  construirFormulario() {
    this.formRegistrarDueno = this.formBuilder.group({
      nombreD: [
        '',
        [Validators.required, Validators.pattern('^[A-Za-z\\s]*$')],
      ],
      apellidoPD: [
        '',
        [Validators.required, Validators.pattern('^[A-Za-z\\s]*$')],
      ],
      apellidoMD: ['', [Validators.pattern('^[A-Za-z\\s]*$')]],
      celularD: ['', [Validators.pattern('^[0-9]{7,8}$')]],
      direccionD: ['', [Validators.required]],
      correoD: ['', [Validators.email]],
    });
  }
  resetForm() {
    this.formRegistrarDueno.reset(); // Restablece el formulario a su estado inicial
    this.verNombreError = false;
    this.verApellidoPError = false;
    this.verApellidoMError = false;
    this.verCelularError = false;
    this.verDireccionError = false;
    this.verCorreoError = false;
    this.obtenerDuenos();
  }

  ngOnInit(): void {
    this.construirFormulario();
    this.obtenerDuenos();
  }
  async guardarDueno() {
    if (this.formRegistrarDueno.valid) {
      let usuarioEnviar: any = {
        nombres: this.formRegistrarDueno.get('nombreD')?.value.toUpperCase(),
        apellidoPaterno: this.formRegistrarDueno.get('apellidoPD')?.value.toUpperCase(),
        apellidoMaterno: this.formRegistrarDueno.get('apellidoMD')?.value.toUpperCase(),
        telefono: this.formRegistrarDueno.get('celularD')?.value,
        correo: this.formRegistrarDueno.get('correoD')?.value,
        direccion: this.formRegistrarDueno.get('direccionD')?.value.toUpperCase(),
      };
      let respuesta = await this.duenosService.enviarCrearDuenoService(
        usuarioEnviar
      );
      if ((respuesta.statusCode = 200)) {
        this.toastr.success(
          'Se registro al dueño' +
            this.formRegistrarDueno.get('nombreD')?.value +
            ' ' +
            this.formRegistrarDueno.get('apellidoPD')?.value +
            ' ' +
            this.formRegistrarDueno.get('apellidoMD')?.value,
          'Proceso correcto!'
        );
        this.obtenerDuenos();
        this.resetForm();
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          text: 'Revise sus datos, e intente nuevamente',
          showConfirmButton: false,
          width: '400px',
          timer: 1500,
        });
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        text: 'Los datos del formulario no son validos',
        showConfirmButton: false,
        width: '400px',
        timer: 1300,
      });
    }
    this.resetForm();
  }

  async eliminarDueno(idDueno: number) {
    Swal.fire({
      text: '¿Esta seguro de eliminar al dueño y sus mascotas?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      width: '350px',
    }).then(async (result) => {
      if (result.isConfirmed) {
        let respuesta = await this.duenosService.eliminarDuenoServices(idDueno);
        if ((respuesta.statusCode = 200)) {
          this.toastr.success('Se elimino al dueño.', 'Proceso correcto !');
          this.obtenerDuenos();
        } else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            text: 'Revise sus datos, e intente nuevamente',
            showConfirmButton: false,
            width: '400px',
            timer: 1300,
          });
        }
      }
    });
  }

  async obtenerDuenos() {
    try {
      // el back esta como quieres
      let respuesta = await this.duenosService.listarDuenosService(); // mandar el servicio

      if ((respuesta.statusCode = 200)) {
        this.listaDuenos = respuesta.datos;
      }
    } catch (error) {
      // en caso de error
      alert(JSON.stringify(error));
    }
  }
  cerrarModal() {
    // Limpiar los campos del formulario
    this.formRegistrarDueno = this.formBuilder.group({
      nombreD: [''],
      apellidoPD: [''],
      apellidoMD: [''],
      celularD: [''],
      direccionD: [''],
      correoD: [''],
    });

    // Cerrar el modal
    const modal = document.getElementById('modalDueno');
    if (modal) {
      modal.style.display = 'none';
    }
  }
  abrirVentanaMascotas(idDueno: string) {
    this.router.navigate(['/principal/mostrarMascotas']);
    localStorage.setItem('idDueno', idDueno);
    console.log(idDueno);
  }
  buscarDueno() {
    if (!this.buscarTexto) {
      this.obtenerDuenos();
    } else {
      this.listaDuenos = this.listaDuenos.filter(
        (dueno: any) =>
          dueno.nombres.toLowerCase().includes(this.buscarTexto) ||
          dueno.apellidoPaterno.toLowerCase().includes(this.buscarTexto) ||
          dueno.apellidoMaterno.toLowerCase().includes(this.buscarTexto)
      );
    }
  }
  esRol(rol: string): boolean {
    const roles = this.cookieService.get('rol');
    return roles === rol;
  }
}
