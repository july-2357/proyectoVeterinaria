import { RazasService } from './../../services/razas.service';
import { DuenosService } from './../../services/duenos.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { EspeciesService } from 'src/app/services/especies.service';
import { MascotasService } from 'src/app/services/mascotas.service';

@Component({
  selector: 'app-mascotas',
  templateUrl: './mascotas.component.html',
  styleUrls: ['./mascotas.component.css'],
})
export class MascotasComponent implements OnInit {
  [x: string]: any;
  formRegistrarMascota: FormGroup;
  selectedFile: File | undefined;
  listaDuenos: any = []; //   Variable global para guardar la inf
  listaEspecies: any = []; //   Variable global para guardar la inf
  listaRazas: any = [];
  listaMascotas: any = [];
  especieSeleccionada: string = '';
  idEspecieForm: string = '';
  base64String: any;
  especieDes: any;
  constructor(
    private formBuilder: FormBuilder,
    private duenosService: DuenosService,
    private especiesService: EspeciesService,
    private mascotasService: MascotasService
  ) {}

  construirFormulario() {
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
      tatuajeM: ['', [Validators.required]],
      conductaM: ['', [Validators.required]],
      imagen: [''],
    });
  }

  ngOnInit(): void {
    this.construirFormulario();
    this.mostrarDuenos();
    this.mostrarEspecies();
    this.obtenerMascotas();
  }

  imagenCambiada = false;

  archivoSeleccionado(file: any) {
    this.imagenCambiada = true;
    this.formRegistrarMascota.get('imagen')?.setValue(file);
  }

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
        idEspecie: this.idEspecieForm,
        foto: this.base64String,
      };
      let respuesta = await this.mascotasService.enviarCrearMascota(
        mascotaEnviar
      );
      console.log(respuesta);
    } else {
      alert('Formulario Invalido');
      console.log(this.formRegistrarMascota.value);
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

  async obtenerMascotas() {
    try {
      // el back esta como quieres
      let respuesta = await this.mascotasService.listarMascotasServices(); // mandar el servicio

      if ((respuesta.statusCode = 200)) {
        this.listaMascotas = respuesta.datos;
      }
    } catch (error) {
      // en caso de error
      //  alert(JSON.stringify(error));
    }
  }
  calcularEdad(fechaNacimiento: string): { anios: number; meses: number } {
    const fechaNac = new Date(fechaNacimiento);
    const fechaActual = new Date();

    const edadEnMilisegundos = fechaActual.getTime() - fechaNac.getTime();

    const anios = Math.floor(
      edadEnMilisegundos / (1000 * 60 * 60 * 24 * 365.25)
    ); // Consideramos años bisiestos
    const meses = Math.floor(
      (edadEnMilisegundos % (1000 * 60 * 60 * 24 * 365.25)) /
        (1000 * 60 * 60 * 24 * (365.25 / 12))
    ); // Consideramos años de 12 meses

    return { anios, meses };
  }
  async buscarEspecie(idEspecieM: string): Promise<string> {
    try {
      let respuesta = await this.duenosService.listarDuenosService();

      if (respuesta.statusCode === 200) {
        this.listaEspecies = respuesta.datos;

        for (let i = 0; i < this.listaEspecies.length; i++) {
          let especie = this.listaEspecies[i];

          if (especie.idEspecie == idEspecieM) {
            this.especieDes = especie.descripcion;
            return(this.especieDes);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
    return '';
  }
  especieDescripcion: string = '';

async obtenerEspecieDescripcion(idEspecieM: string): Promise<void> {
  this.especieDescripcion = await this.buscarEspecie(idEspecieM);
}
}
