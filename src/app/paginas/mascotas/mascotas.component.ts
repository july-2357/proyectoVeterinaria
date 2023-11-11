import { NgxSpinnerService } from 'ngx-spinner';
import { EnviarDatosService } from './../../services/enviar-datos.service';
import { RazasService } from './../../services/razas.service';
import { DuenosService } from './../../services/duenos.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EspeciesService } from 'src/app/services/especies.service';
import { MascotasService } from 'src/app/services/mascotas.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { ConsultasMService } from 'src/app/services/consultas-m.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-mascotas',
  templateUrl: './mascotas.component.html',
  styleUrls: ['./mascotas.component.css'],
})
export class MascotasComponent implements OnInit {
  formRegistrarMascota: FormGroup;
  formActualizarMascota: FormGroup;
  formPrimeraConsulta: FormGroup;
  selectedFile: File | undefined;
  listaDuenos: any = [];
  listaEspecies: any = [];
  listaRazas: any = [];
  listaMascotas: any = [];
  especieSeleccionada: string = '';
  idRazaForm: string = '';
  base64String: any;
  especieDes: any;
  currentDate: string;
  selectedVacunas: string[] = [];
  detalleVacunasS: any[] = [];

  //para abrir los modales
  mascotaSeleccionada: number | null = null;
  mascotaFotoSeleccionada: number | null = null;
  detalleMascotas: any;
  //Para los errores
  verNombreError = false;
  verDuenoMError = false;
  verColorError = false;
  verEdadError = false;
  verEdadAniosError = false;
  verEdadMesesError = false;
  //para buscar mascota
  buscarTexto: string = '';
  pagina: number = 1;
  textoEnMayusculas: string = '';
  //para primera consulta
  vacunas: string[] = ['Octavalente', 'Parvocoronavirus', 'Hexavalente', 'Traqueobronquitis','Rabia']; // Puedes poblar este array con tus datos
  desparacitaciones: string[] = ['Desparasitación interna', 'Desparasitación externa']; // Puedes poblar este array con tus datos

  constructor(
    private formBuilder: FormBuilder,
    private duenosService: DuenosService,
    private toastr: ToastrService,
    private especiesService: EspeciesService,
    private mascotasService: MascotasService,
    private enviarDatosService: EnviarDatosService,
    private router: Router,
    private cookieService: CookieService, private consultasService:ConsultasMService, private spinner:NgxSpinnerService
  ) {}
  opcionSeleccionada = 'none';

  onChangeOption(event: Event) {
    this.opcionSeleccionada = (event.target as HTMLSelectElement).value;
  }
  construirFormulario() {
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
  construirFormularioPrimeraConsulta() {
    this.formPrimeraConsulta = this.formBuilder.group({
      idMascota: [''],
      condicionCorporal: ['', []],
      habitad: ['', []],
      estadoReproductivo: ['', []],
      convivenciaConAnimales: ['', []],
      detalleConvivencia: ['', []],
      vacunacion: ['', []],
      detalleVacunas: [''],
      desparacitacion: [''],
      detalleDesparacitacion: [''],
    });
  }

  onVacunasSelectionChange(event: any) {
    const selectedVacunas = Array.from(event.target.selectedOptions).map(
      (option: any) => option.value
    );
    this.formPrimeraConsulta.setControl(
      'detalleVacunas',
      this.formBuilder.array(selectedVacunas)
    );
  }
  resetFormPrimeraConsulta() {
    this.formPrimeraConsulta.reset(); // Restablece el formulario a su estado inicial
  }
  resetForm() {
    this.formRegistrarMascota.reset(); // Restablece el formulario a su estado inicial
    this.verNombreError = false;
    this.verDuenoMError = false;
    this.verColorError = false;
    this.verEdadError = false;
    this.verEdadAniosError = false;
    this.verEdadMesesError = false;
    this.base64String = null;
    this.opcionSeleccionada = 'none';
    this.base64String = null;
  }
  resetFormFoto() {
    this.mascotaFotoSeleccionada = null;
    this.base64String = null;
  }
  ngOnInit(): void {
    this.spinner.show();
    this.construirFormulario();
    this.construirFormularioActualizarDatos();
    this.construirFormularioPrimeraConsulta();
    this.mostrarDuenos();
    this.mostrarEspecies();
    this.obtenerMascotas();
    this.spinner.hide();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      this.base64String = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  fotoTomada(base64Image: string) {
    this.base64String = base64Image;
  }

  async guardarMascota() {
    if (this.formRegistrarMascota.valid) {
      let mascotaEnviar: any = {
        color: this.formRegistrarMascota.get('colorM')?.value.toUpperCase(),
        fecha_nacimiento: this.formRegistrarMascota.get('fechaNac')?.value,
        nombreMascota: this.formRegistrarMascota
          .get('nombreM')
          ?.value.toUpperCase(),
        sexo: this.formRegistrarMascota.get('sexoM')?.value.toUpperCase(),
        tatuaje: this.formRegistrarMascota.get('tatuajeM')?.value,
        idDueno: this.formRegistrarMascota.get('duenoM')?.value,
        conducta: this.formRegistrarMascota
          .get('conductaM')
          ?.value.toUpperCase(),
        idRaza: this.idRazaForm,
        foto: this.base64String,
      };
      let respuesta = await this.mascotasService.enviarCrearMascota(
        mascotaEnviar
      );
      if ((respuesta.statusCode = 200)) {
        this.toastr.success(
          'Se registro a la mascota ' +
            this.formRegistrarMascota.get('nombreM')?.value.toUpperCase(),
          'Registro correcto!'
        );

        this.obtenerMascotas();
        this.resetForm();
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          text: 'Verifique los datos.',
          showConfirmButton: false,
          width: '400px',
          timer: 1300,
        });
      }
    } else {
      alert('Formulario Invalido');
    }
    this.resetForm();
  }

  async guardarPrimeraConsulta() {
    if (this.formPrimeraConsulta.valid) {
      let primeraConsulta: any = {
        condicionCorporal:
          this.formPrimeraConsulta.get('condicionCorporal')?.value.toUpperCase(),
        habitad: this.formPrimeraConsulta.get('habitad')?.value.toUpperCase(),
        estadoReproductivo:
          this.formPrimeraConsulta.get('estadoReproductivo')?.value.toUpperCase(),
        detalleConvivencia:
          this.formPrimeraConsulta.get('detalleConvivencia')?.value.toUpperCase(),
        detalleVacunas: JSON.stringify(this.formPrimeraConsulta.get('detalleVacunas')?.value),
        fechaUltimaVacunacion: '',
        detalleDesparacitacion:   this.formPrimeraConsulta.get('detalleDesparacitacion')?.value.toUpperCase(),
        fechaUltimadesparacitacion:'',
        idMascota: this.formPrimeraConsulta.get('idMascota')?.value,
      };
      console.log(primeraConsulta);

      let respuesta = await this.consultasService.enviarCrearPrimeraConsulta(
        primeraConsulta
      );
      if ((respuesta.statusCode = 200)) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se registro los datos adicionales',
          text: 'Ya puede registrar las consultas de la mascota',
          showConfirmButton: true,
          timer: 1500,
        });
        this.obtenerMascotas();
        this.formPrimeraConsulta.reset();
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
      console.log(this.formPrimeraConsulta.value);
    }
  }

  async eliminarMascota(idMascota: number) {
    Swal.fire({
      title: '',
      text: '¿Esta seguro de eliminar a la mascota?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      width: '350px',
    }).then(async (resultado) => {
      if (resultado.value) {
        let respuesta = await this.mascotasService.eliminarMascotaServices(
          idMascota
        );
        if ((respuesta.statusCode = 200)) {
          this.toastr.success('Se elimino a la mascota ', 'Proceso correcto!');
          this.obtenerMascotas();
        } else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            text: 'No se pudo eliminar',
            showConfirmButton: false,
            width: '400px',
            timer: 1300,
          });
        }
      } else {
      }
    });
  }

  async buscarMascota() {
    if (!this.buscarTexto) {
      await this.obtenerMascotas();
    } else {
      this.listaMascotas = this.listaMascotas.filter(
        (mascota: any) =>
          mascota.mascota.nombreMascota.toLowerCase().includes(this.buscarTexto) ||
          mascota.mascota.nombreMascota.toLowerCase().includes(this.buscarTexto) ||
          mascota.mascota.nombreMascota.toLowerCase().includes(this.buscarTexto)
      );
    }
  }
  async abrirActualizarFoto(itemId: number) {
    this.mascotaFotoSeleccionada = itemId;
  }
  async abrirModalEditarMascota(itemId: number) {
    this.mascotaSeleccionada = itemId;
    this.detalleMascotas = this.listaMascotas.find(
      (mascota: any) => mascota.mascota.idMascota === this.mascotaSeleccionada
    );
    this.detalleMascotas = this.detalleMascotas.mascota;
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
      editarespecieM: this.detalleMascotas.raza.descripcion,
      editarrazaM: this.detalleMascotas.raza.descripcion,
      editarsexoM: this.detalleMascotas.sexo,
      editaredadAnios: this.calcularEdad(this.detalleMascotas.fecha_nacimiento)
        .anios,
      editaredadMeses: this.calcularEdad(this.detalleMascotas.fecha_nacimiento)
        .meses,
      editartatuajeM: this.detalleMascotas.tatuaje,
      editarconductaM: this.detalleMascotas.conducta,
      editarimagen: this.detalleMascotas.foto,
    });
  }
  async abrirModalPrimeraConsulta(itemId: number) {
    this.mascotaSeleccionada = itemId;
    this.detalleMascotas = this.listaMascotas.find(
      (mascota: any) => mascota.mascota.idMascota === this.mascotaSeleccionada
    );
    this.detalleMascotas = this.detalleMascotas.mascota;

    this.formPrimeraConsulta.patchValue({
      idMascota: this.detalleMascotas.idMascota,
    });
    console.log(this.formPrimeraConsulta.value);
  }
  async actualizarMascota() {
    if (this.formActualizarMascota.valid) {
      let fechaNacimiento =
        this.formActualizarMascota.get('editarfechaNac')?.value;
      let mascotaEditarEnviar: any = {
        color: this.formActualizarMascota
          .get('editarcolorM')
          ?.value.toUpperCase(),
        fecha_nacimiento: '',
        nombreMascota: this.formActualizarMascota
          .get('editarnombreM')
          ?.value.toUpperCase(),
        sexo: this.formActualizarMascota.get('editarsexoM')?.value,
        tatuaje: this.formActualizarMascota
          .get('editartatuajeM')
          ?.value.toUpperCase(),
        idDueno: this.detalleMascotas.idDueno,
        conducta: this.formActualizarMascota
          .get('editarconductaM')
          ?.value.toUpperCase(),
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
          'Se actualizaron datos de la mascota ',
          'Proceso correcto !'
        );
        this.obtenerMascotas();
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          text: 'Verifique los datos.',
          showConfirmButton: false,
          width: '400px',
          timer: 1300,
        });
      }
    } else {
      alert('El formulario no es valido');
    }
  }
  async actualizarFotoMascota(mascota: any) {
    if (
      this.base64String != null &&
      this.base64String != undefined &&
      this.base64String != ''
    ) {
      let mascotaEditarEnviar: any = {
        color: mascota.color,
        fecha_nacimiento: '',
        nombreMascota: mascota.nombreMascota,
        sexo: mascota.sexo,
        tatuaje: mascota.tatuaje,
        conducta: mascota.conducta,
        foto: this.base64String,
        idDueno: mascota.idDueno,
        idRaza: mascota.idRaza,
      };
      mascotaEditarEnviar.fecha_nacimiento = new Date(mascota.fecha_nacimiento)
        .toISOString()
        .substring(0, 10);
      let respuesta = await this.mascotasService.actualizarMascotasServices(
        mascota.idMascota,
        mascotaEditarEnviar
      );
      if (respuesta.statusCode === 200) {
        this.toastr.success(
          'Se actualizo la fotografia de la mascota ',
          'Proceso correcto !'
        );
        this.obtenerMascotas();
        this.resetFormFoto();
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          text: 'No se selecciono fotografía',
          showConfirmButton: false,
          width: '400px',
          timer: 1300,
        });
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        text: 'No se selecciono fotografía',
        showConfirmButton: false,
        width: '400px',
        timer: 1300,
      });
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
  async mostrarDuenos() {
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
  async mostrarEspecies() {
    try {
      // el back esta como quieres
      let respuesta = await this.especiesService.listarEspeciesService(); // mandar el servicio

      if ((respuesta.statusCode = 200)) {
        this.listaEspecies = respuesta.datos;
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
      if ((respuesta.statusCode = 200)) {
        this.listaRazas = respuesta.datos;
      }
    } catch (error) {
      // en caso de error
      alert(JSON.stringify(error));
    }
  }
  async obtenerMascotas() {
    try {
      let respuesta = await this.mascotasService.listarMascotasServices();

      if (respuesta.statusCode === 200) {
        this.listaMascotas = respuesta.datos;
      }
    } catch (error) {
      // Manejo de errores
      // alert(JSON.stringify(error));
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
  navegarVentanaDestino(mascota: any) {
    const param = {
      idMascota: mascota.idMascota,
      idDueno: mascota.idDueno,
      color: mascota.color,
      fecha_nacimiento: mascota.fecha_nacimiento,
      nombreMascota: mascota.nombreMascota,
      sexo: mascota.sexo,
      tatuaje: mascota.tatuaje,
      conducta: mascota.conducta,
      duenoNombre: mascota.dueno.nombres,
      duenoApellidoMaterno: mascota.dueno.apellidoPaterno,
      duenoApellidoPaterno: mascota.dueno.apellidoMaterno,
      idEspecie: mascota.raza.idEspecie,
      foto: mascota.foto,
    };
    this.enviarDatosService.setDatos(param);
    this.router.navigate(['/principal/consultas']);
  }
  navegarVentanaHistorial(mascota: any) {
    localStorage.setItem('idMascotaHistorial', mascota.idMascota);
    localStorage.setItem('idDuenoHistorial', mascota.dueno.idDuenos);
    this.router.navigate(['/principal/historial']);
  }
  esRol(rol: string): boolean {
    const roles = this.cookieService.get('rol');
    return roles === rol;
  }
}
