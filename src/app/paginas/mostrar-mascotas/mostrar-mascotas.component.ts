import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { DuenosService } from 'src/app/services/duenos.service';
import { EnviarDatosService } from 'src/app/services/enviar-datos.service';
import { EspeciesService } from 'src/app/services/especies.service';
import { MascotasService } from 'src/app/services/mascotas.service';
import { RazasService } from 'src/app/services/razas.service';
import { DuenosPdfComponent } from 'src/app/paginas/duenos-pdf/duenos-pdf.component';
import Swal from 'sweetalert2';
import * as html2pdf from 'html2pdf.js';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-mostrar-mascotas',
  templateUrl: './mostrar-mascotas.component.html',
  styleUrls: ['./mostrar-mascotas.component.css'],
})
export class MostrarMascotasComponent implements OnInit {


  showPdf: boolean = false;

  formRegistrarMascota: FormGroup;
  selectedFile: File | undefined;
  listaDuenos: any = []; //   Variable global para guardar la inf
  listaEspecies: any = []; //   Variable global para guardar la inf
  listaRazas: any = [];
  listaMascotas: any = [];
  datosDueno: any;
  especieSeleccionada: string = '';
  idEspecieForm: string = '';
  idDuenoPDF: any;
  base64String: any;
  especieDes: any;
  formActualizarDueno: FormGroup;
  idRazaForm: string = '';
  //Para los errores
  verNombreError = false;
  verDuenoMError = false;
  verColorError = false;
  verEdadError = false;
  verEdadAniosError = false;
  verEdadMesesError = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private duenosService: DuenosService,
    private especiesService: EspeciesService,
    private mascotasService: MascotasService,
    private enviarDatosService: EnviarDatosService,
private cookieService:CookieService
  ) {}
  async construirFormulario() {
    const idDuenos = localStorage.getItem('idDueno');
    let datosAntiguosDueno: any;
    if (idDuenos !== null) {
      const idDuenoNumerico = parseInt(idDuenos, 10);
      let respuesta = await this.duenosService.listarMascotasdeDuenosService(
        idDuenoNumerico
      );
      if ((respuesta.statusCode = 200)) {
        datosAntiguosDueno = respuesta.datos;
        console.log(datosAntiguosDueno);
      }
      this.formActualizarDueno = this.formBuilder.group({
        editarNombreDueno: [datosAntiguosDueno.nombres, [Validators.required]],
        editarApellidoPat: [
          datosAntiguosDueno.apellidoPaterno,
          [Validators.required],
        ],
        editarApellidoMat: [
          datosAntiguosDueno.apellidoMaterno,
          [Validators.required],
        ],
        editarCelular: [datosAntiguosDueno.telefono, [Validators.required]],
        editarDireccion: [datosAntiguosDueno.direccion, [Validators.required]],
        editarCorreo: [datosAntiguosDueno.correo, [Validators.required]],
      });
    }
  }


  async guardarMascota() {
    if (this.formRegistrarMascota.valid) {
      let mascotaEnviar: any = {
        color: this.formRegistrarMascota.get('colorM')?.value,
        fecha_nacimiento: this.formRegistrarMascota.get('fechaNac')?.value,
        nombreMascota: this.formRegistrarMascota.get('nombreM')?.value,
        sexo: this.formRegistrarMascota.get('sexoM')?.value,
        tatuaje: this.formRegistrarMascota.get('tatuajeM')?.value,
        idDueno: this.idDuenoPDF,
        conducta: this.formRegistrarMascota.get('conductaM')?.value,
        idRaza: this.idRazaForm,
        foto: this.base64String,
      };
      let respuesta = await this.mascotasService.enviarCrearMascota(
        mascotaEnviar
      );
      if ((respuesta.statusCode = 200)) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se registro mascota',
          showConfirmButton: true,
          timer: 1500,
        });
        this.mostrarDatosDuenoyMascotas();
        // this.resetForm();
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Revise los datos.',
          showConfirmButton: true,
          timer: 1500,
        });      }
    } else {
      alert('Formulario Invalido');
      console.log(this.formRegistrarMascota.value);
    }
  }

  ngOnInit(): void {
    this.construirFormulario();
    this.mostrarDatosDuenoyMascotas();
    this.mostrarDuenos();
    this.mostrarEspecies();
    this.construirFormularioAgregarMascota();
    this.idDuenoPDF = localStorage.getItem('idDueno');
  }
  construirFormularioAgregarMascota() {
    this.formRegistrarMascota = this.formBuilder.group({
      nombreM: ['', [Validators.required]],
      duenoM: [' ', [Validators.required]],
      colorM: ['', [Validators.required]],
      fechaNac: ['', [Validators.required]],
      especieM: ['', [Validators.required]],
      razaM: ['', [Validators.required]],
      sexoM: ['', [Validators.required]],
      edadAnios: ['', [Validators.required]],
      edadMeses: ['', [Validators.required]],
      tatuajeM: [' ', []],
      conductaM: [' ', []],
      imagen: [' '],
    });
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      this.base64String = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  async mostrarDatosDuenoyMascotas() {
    try {
      const idDuenos = localStorage.getItem('idDueno');

      if (idDuenos !== null) {
        const idDuenoNumerico = parseInt(idDuenos, 10);

        let respuesta = await this.duenosService.listarMascotasdeDuenosService(
          idDuenoNumerico
        );
        if ((respuesta.statusCode = 200)) {
          this.listaMascotas = respuesta.datos.listaMascotas;
          this.datosDueno = respuesta.datos;
          console.log(this.listaMascotas);
          console.log(this.datosDueno);
        }
      } else {
        // Manejar el caso en que idDuenos es null
        console.error('Error: El valor de idDuenos es null.');
      }
    } catch (error) {
      // en caso de error
      //  alert(JSON.stringify(error));
    }
  }

  calcularFechaNacimiento() {
    const anios = this.formRegistrarMascota.get('edadAnios')?.value;
    const meses = this.formRegistrarMascota.get('edadMeses')?.value;

    const fechaActual = new Date();
    const fechaNacimiento = new Date();

    fechaNacimiento.setFullYear(fechaActual.getFullYear() - anios);
    fechaNacimiento.setMonth(fechaActual.getMonth() - meses);

    this.formRegistrarMascota
      .get('fechaNac')
      ?.patchValue(fechaNacimiento.toISOString().substring(0, 10));
  }
  async mostrarDuenos() {
    try {
      // el back esta como quieres
      let respuesta = await this.duenosService.listarDuenosService(); // mandar el servicio

      if ((respuesta.statusCode = 200)) {
        this.listaDuenos = respuesta.datos;
        console.log(this.listaDuenos);
        console.log(this.listaDuenos.length);
      }
    } catch (error) {
      // en caso de error
      alert(JSON.stringify(error));
    }
  }
  async mostrarEspecies() {
    try {
      // el back esta como quieres
      let respuesta = await this.especiesService.listarEspeciesService(); // mandar el servicio

      if ((respuesta.statusCode = 200)) {
        this.listaEspecies = respuesta.datos;
        console.log(this.listaEspecies);
      }
    } catch (error) {
      // en caso de error
      alert(JSON.stringify(error));
    }
  }
  async mostrarRazas() {
    try {
      // el back esta como quieres

      let respuesta = await this.especiesService.listarRazasService(
        this.especieSeleccionada
      ); // mandar el servicio
      console.log(this.especieSeleccionada);
      if ((respuesta.statusCode = 200)) {
        this.listaRazas = respuesta.datos;
        console.log(this.listaRazas);
      }
    } catch (error) {
      // en caso de error
      alert(JSON.stringify(error));
    }
  }

  calcularEdad(fechaNacimiento: string): { anios: number; meses: number } {
    // Formatear la cadena de fecha en "YYYY-MM-DD" (asumiendo que el formato original es "DD/MM/YYYY")
    const partesFecha = fechaNacimiento.split('/');
    const fechaFormateada = `${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`;

    const fechaNac = new Date(fechaFormateada);
    const fechaActual = new Date();

    const edadEnMilisegundos = fechaActual.getTime() - fechaNac.getTime();

    const anios = Math.floor(
      edadEnMilisegundos / (1000 * 60 * 60 * 24 * 365.25)
    );
    const meses = Math.floor(
      (edadEnMilisegundos % (1000 * 60 * 60 * 24 * 365.25)) /
        (1000 * 60 * 60 * 24 * (365.25 / 12))
    );

    return { anios, meses };
  }
  async actualizarDatosDueno() {
    if (this.formActualizarDueno.valid) {

      let usuarioEnviar: any = {
        nombres: this.formActualizarDueno.get('editarNombreDueno')?.value,
        apellidoPaterno:
          this.formActualizarDueno.get('editarApellidoPat')?.value,
        apellidoMaterno:
          this.formActualizarDueno.get('editarApellidoMat')?.value,
        telefono: this.formActualizarDueno.get('editarCelular')?.value,
        correo: this.formActualizarDueno.get('editarCorreo')?.value,
        direccion: this.formActualizarDueno.get('editarDireccion')?.value,
        idDuenos: localStorage.getItem('idDueno'),
      };
      const idDuenos = localStorage.getItem('idDueno');
      let idDuenoNumerico: number | null = null;

      if (idDuenos !== null) {
        idDuenoNumerico = parseInt(idDuenos, 10);
      }

      if (idDuenoNumerico !== null) {
        let respuesta = await this.duenosService.actualizarDuenosService(
          idDuenoNumerico,
          usuarioEnviar
        );
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se actualizaron datos del dueño',
          showConfirmButton: true,
          timer: 1500,
        });
           this.mostrarDatosDuenoyMascotas();
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
  navegarVentanaDestino(mascota: any) {
    if (mascota) {
      const param = {
        idMascota: mascota?.idMascota,
        color: mascota?.color,
        fecha_nacimiento: mascota?.fecha_nacimiento,
        nombreMascota: mascota?.nombreMascota,
        sexo: mascota?.sexo,
        tatuaje: mascota?.tatuaje,
        conducta: mascota?.conducta,
        duenoNombre: this.datosDueno.nombres,
        duenoApellidoMaterno: this.datosDueno.apellidoPaterno,
        duenoApellidoPaterno: this.datosDueno.apellidoMaterno,
        idEspecie: mascota?.raza.idEspecie,
        foto: mascota?.foto,
      };
      this.enviarDatosService.setDatos(param);
      this.router.navigate(['/principal/consultas']);
    }
  }
  navegarVentanaHistorial(mascota: any) {
    localStorage.setItem('idMascotaHistorial', mascota?.idMascota);
    localStorage.setItem('idDuenoHistorial', mascota.dueno?.idDuenos);
    this.router.navigate(['/principal/historial']);
  }
  esRol(rol: string): boolean {
    const roles = this.cookieService.get('rol');
    return roles === rol;
  }

}
