import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DuenosService } from 'src/app/services/duenos.service';
import { EnviarDatosService } from 'src/app/services/enviar-datos.service';
import { EspeciesService } from 'src/app/services/especies.service';
import { MascotasService } from 'src/app/services/mascotas.service';
import { RazasService } from 'src/app/services/razas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-mascotas',
  templateUrl: './registrar-mascotas.component.html',
  styleUrls: ['./registrar-mascotas.component.css']
})
export class RegistrarMascotasComponent implements OnInit {
  formRegistrarMascota:FormGroup;
  base64String: any;
  idRazaForm: string = '';
  listaDuenos: any = [];
  listaEspecies: any = []; //   Variable global para guardar la inf
  listaRazas: any = [];
  listaMascotas: any = [];
  especieSeleccionada: string = '';
    //Para los errores
    verNombreError = false;
    verDuenoMError = false;
    verColorError = false;
    verEdadError = false;
    verEdadAniosError = false;
    verEdadMesesError = false;
    //para buscar mascota
    buscarTexto:string='';
  constructor( private formBuilder:FormBuilder, private duenosService: DuenosService,
    private especiesService: EspeciesService,
    private razasService: RazasService,
    private mascotasService: MascotasService,
    private enviarDatosService: EnviarDatosService,
    private router: Router) { }

  construirFormulario( ) {
    this.formRegistrarMascota = this.formBuilder.group({
      nombreM: ['', [Validators.required]],
      duenoM: ['', [Validators.required]],
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

  ngOnInit(): void {
  }
  imagenCambiada = false;



  onFileSelected(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      this.base64String = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  async guardarMascota() {
    if (this.formRegistrarMascota.valid) {
      let mascotaEnviar: any = {
        color: this.formRegistrarMascota.get('colorM')?.value,
        fecha_nacimiento: this.formRegistrarMascota.get('fechaNac')?.value,
        nombreMascota: this.formRegistrarMascota.get('nombreM')?.value,
        sexo: this.formRegistrarMascota.get('sexoM')?.value,
        tatuaje: this.formRegistrarMascota.get('tatuajeM')?.value,
        idDueno: this.formRegistrarMascota.get('duenoM')?.value,
        conducta: this.formRegistrarMascota.get('conductaM')?.value,
        idRaza: this.idRazaForm,
        foto: this.base64String,
      };
      let respuesta = await this.mascotasService.enviarCrearMascota(
        mascotaEnviar
      );
      if ((respuesta.statusCode = 200)) {
        Swal.fire('Hello!', 'This is a SweetAlert popup!', 'success');
       this.obtenerMascotas();
       // this.resetForm();
      } else {
        Swal.fire('Hello!', 'Revise los datos por favor', 'error');
      }
    } else {
      alert('Formulario Invalido');
      console.log(this.formRegistrarMascota.value);
    }

  }
  async obtenerMascotas() {
    try {
      // el back esta como quieres
      let respuesta = await this.mascotasService.listarMascotasServices(); // mandar el servicio

      if ((respuesta.statusCode = 200)) {
        this.listaMascotas = respuesta.datos;
        console.log(this.listaMascotas);
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



}
