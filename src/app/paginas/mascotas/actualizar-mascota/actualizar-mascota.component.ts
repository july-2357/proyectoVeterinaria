import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MascotasService } from 'src/app/services/mascotas.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-actualizar-mascota',
  templateUrl: './actualizar-mascota.component.html',
  styleUrls: ['./actualizar-mascota.component.css'],
})
export class ActualizarMascotaComponent implements OnInit {
  @Input() idMascota: number;
  formActualizarMascota: FormGroup;
  selectedFile: File | undefined;
  listaMascotas: any = [];
  mascotaSeleccionada: number | null = null;
  detalleMascotas: any;
  especie: any;
  constructor(
    private formBuilder: FormBuilder,
    private mascotasService: MascotasService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.obtenerMascotas();
    this.construirFormularioActualizarDatos();
    this.abrirModalEditarMascota();
  }
  construirFormularioActualizarDatos() {
    this.formActualizarMascota = this.formBuilder.group({
      editarnombreM: ['', [Validators.required]],
      editarduenoM: ['', [Validators.required]],
      editarcolorM: ['', [Validators.required]],
      editarfechaNac: ['', [Validators.required]],
      editarespecieM: ['', [Validators.required]],
      editarrazaM: ['', [Validators.required]],
      editarsexoM: ['', [Validators.required]],
      editaredadAnios: ['', [Validators.required]],
      editaredadMeses: ['', [Validators.required]],
      editartatuajeM: [' '],
      editarconductaM: [' '],
      editarimagen: [''],
    });
  }
  async abrirModalEditarMascota() {
    setTimeout(() => {
      this.mascotaSeleccionada = this.idMascota;
      const mascota = this.listaMascotas.find(
        (mascota: any) => mascota.mascota.idMascota === this.mascotaSeleccionada
      );
      this.detalleMascotas = mascota.mascota;
      if (this.detalleMascotas.raza.idEspecie == 1) {
        this.especie = 'CANINO';
      } else {
        this.especie = 'FELINO';
      }
      const fechaNacimiento = new Date(this.detalleMascotas.fecha_nacimiento);
      const fechaFormateada = fechaNacimiento.toISOString().substring(0, 10);
      this.formActualizarMascota.patchValue({
        editarnombreM: this.detalleMascotas.nombreMascota,
        editarduenoM:
          this.detalleMascotas.dueno.nombres +
          ' ' +
          this.detalleMascotas.dueno.apellidoMaterno +
          ' ' +
          this.detalleMascotas.dueno.apellidoPaterno,
        editarcolorM: this.detalleMascotas.color,

        editarfechaNac: fechaFormateada,
        editarespecieM: this.especie,
        editarrazaM: this.detalleMascotas.raza.descripcion,
        editarsexoM: this.detalleMascotas.sexo,
        editaredadAnios: this.calcularEdad(
          this.detalleMascotas.fecha_nacimiento
        ).anios,
        editaredadMeses: this.calcularEdad(
          this.detalleMascotas.fecha_nacimiento
        ).meses,
        editartatuajeM: this.detalleMascotas.tatuaje,
        editarconductaM: this.detalleMascotas.conducta,
        editarimagen: this.detalleMascotas.foto,
      });
    }, 1000);
  }
  async obtenerMascotas() {
    try {
      let respuesta = await this.mascotasService.listarMascotasServices();
      if ((respuesta.statusCode = 200)) {
        this.listaMascotas = respuesta.datos;
      }
    } catch (error) {}
  }
  calcularEdad(fechaNacimiento: string): { anios: number; meses: number } {
    const fechaNac = new Date(fechaNacimiento);
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
  calcularFechaNacimientoEditar() {
    const anios = this.formActualizarMascota.get('editaredadAnios')?.value;
    const meses = this.formActualizarMascota.get('editaredadMeses')?.value;

    const fechaActual = new Date();
    const fechaNacimiento = new Date();

    fechaNacimiento.setFullYear(fechaActual.getFullYear() - anios);
    fechaNacimiento.setMonth(fechaActual.getMonth() - meses);

    this.formActualizarMascota
      .get('editarfechaNac')
      ?.patchValue(fechaNacimiento.toISOString().substring(0, 10));
  }
  async actualizarMascota() {
    this.mascotaSeleccionada = this.idMascota;
    this.detalleMascotas = this.listaMascotas.find(
      (mascota: any) => mascota.mascota.idMascota === this.mascotaSeleccionada
    );
    this.detalleMascotas = this.detalleMascotas.mascota;
    console.log(this.detalleMascotas);
    let fechaNacimiento =
      this.formActualizarMascota.get('editarfechaNac')?.value;
    let mascotaEditarEnviar: any = {
      color: this.formActualizarMascota.get('editarcolorM')?.value,
      fecha_nacimiento: '',
      nombreMascota: this.formActualizarMascota.get('editarnombreM')?.value,
      sexo: this.formActualizarMascota.get('editarsexoM')?.value,
      tatuaje: this.formActualizarMascota.get('editartatuajeM')?.value,
      idDueno: this.detalleMascotas.idDueno,
      conducta: this.formActualizarMascota.get('editarconductaM')?.value,
      idRaza: this.detalleMascotas.idRaza,
      foto: this.formActualizarMascota.get('editarimagen')?.value,
    };
    mascotaEditarEnviar.fecha_nacimiento = new Date(fechaNacimiento)
      .toISOString()
      .substring(0, 10);
    let respuesta = await this.mascotasService.actualizarMascotasServices(
      this.detalleMascotas.idMascota,
      mascotaEditarEnviar
    );
    if ((respuesta.statusCode = 200)) {
      this.toastr.success(
        'Se actualizaron los datos de la mascota',
        'Proceso correcto!'
      );

      this.obtenerMascotas();
    } else {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Revise los datos.',
        showConfirmButton: true,
        timer: 1500,
      });
    }
  }
}
