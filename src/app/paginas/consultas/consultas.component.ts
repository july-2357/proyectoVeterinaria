import { EnviarDatosService } from './../../services/enviar-datos.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MascotasService } from 'src/app/services/mascotas.service';
import { ConsultasMService } from 'src/app/services/consultas-m.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css'],
})
export class ConsultasComponent implements OnInit {
  formRegistrarConsulta: FormGroup;
  formRegistrarVacuna: FormGroup;
  formRegistrarCirugia: FormGroup;
  formRegistrarDesparacitacion: FormGroup;
  listaMascotas: any = [];
  datosMascota: any;
  datosConsulta: any;
  mascotaSeleccionada: any;
  idMascota: any;
  today: string;
  //para ver los errores
  //errores de vacunas
  verTempVError = false;
  verFCVError = false;
  verFRVError = false;
  verPesoVError = false;
  //errores de consultas
  verTempCError = false;
  verFCCError = false;
  verFRCError = false;
  verPesoCError = false;
  //errores de desparacitaciones
  verTempDError = false;
  verFCDError = false;
  verFRDError = false;
  verPesoDError = false;
  //errores de cirugias
  verTempCiError = false;
  verFCCiError = false;
  verFRCiError = false;
  verPesoCiError = false;

  //Para obtenet la fecha actual
  currentDate: string;
  constructor(
    private formBuilder: FormBuilder,
    private consultasService: ConsultasMService,
    private enviarDatosService: EnviarDatosService,
    private mascotasService: MascotasService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    if (this.enviarDatosService.getDatos() != null) {
      this.datosMascota = this.enviarDatosService.getDatos();

      this.idMascota = this.datosMascota.idMascota;
    } else {
      this.datosMascota = '';
    }
    const today = new Date();
    this.currentDate = today.toISOString().substring(0, 10);
    this.construirFormularioCirugias();
    this.construirFormularioConsulta();
    this.construirFormularioVacuna();
    this.construirFormularioDesparacitacion();
    this.obtenerMascotas();
  }
  ngOnDestroy(): void {
    this.enviarDatosService.limpiarDatos();
  }
  resetFormVac() {
    this.formRegistrarVacuna.reset(); // Restablece el formulario a su estado inicial
    this.verTempVError = false;
    this.verFCVError = false;
    this.verFRVError = false;
    this.verPesoVError = false;
  }
  resetFormCon() {
    this.formRegistrarConsulta.reset(); // Restablece el formulario a su estado inicial
    this.verTempCError = false;
    this.verFCCError = false;
    this.verFRCError = false;
    this.verPesoCError = false;
  }
  resetFormDes() {
    this.formRegistrarDesparacitacion.reset(); // Restablece el formulario a su estado inicial
    this.verTempDError = false;
    this.verFCDError = false;
    this.verFRDError = false;
    this.verPesoDError = false;
  }
  resetFormCir() {
    this.formRegistrarCirugia.reset(); // Restablece el formulario a su estado inicial
    this.verTempCiError = false;
    this.verFCCiError = false;
    this.verFRCiError = false;
    this.verPesoCiError = false;
  }
  construirFormularioConsulta() {
    this.formRegistrarConsulta = this.formBuilder.group({
      /*Anamnesis */
      apetito: ['Normal', [Validators.required]],
      agua: ['Normal', [Validators.required]],
      conducta: ['Normal', [Validators.required]],
      defecacion: ['Normal', [Validators.required]],
      alteracionesRes: ['Normal', [Validators.required]],
      alteracionesNeuro: ['Normal', [Validators.required]],
      problemasUr: ['Normal', [Validators.required]],
      /*Control medico */
      temperaturaConsulta: [
        '',
        [Validators.required, Validators.pattern('^[1-9][0-9]*$')],
      ],
      frecuenciaCardiacaConsulta: [
        '',
        [Validators.required, Validators.pattern('^[1-9][0-9]*$')],
      ],
      frecuenciaRespiratoriaConsulta: [
        '',
        [Validators.required, Validators.pattern('^[1-9][0-9]*$')],
      ],
      pesoConsulta: [
        '',
        [Validators.required, Validators.pattern('^[0-9]+([,.][0-9]+)?$')],
      ],
      precioConsulta: [
        '',
        [Validators.required, Validators.pattern('^[0-9]+([,.][0-9]+)?$')],
      ],
      /*Consulta medica */
      motivoConsulta: ['', [Validators.required]],
      diagnosticoConsulta: ['', [Validators.required]],
      tratamiento: ['', [Validators.required]],
      fechaConsulta: ['', [Validators.required]],
      proxVisita: ['', [Validators.required]],
    });
  }
  construirFormularioVacuna() {
    this.formRegistrarVacuna = this.formBuilder.group({
      /*Control medico */
      temperaturaVacunas: [
        '',
        [Validators.required, Validators.pattern('^[1-9][0-9]*$')],
      ],
      frecuenciaCardiacaVacunas: [
        '',
        [Validators.required, Validators.pattern('^[1-9][0-9]*$')],
      ],
      frecuenciaRespiratoriaVacunas: [
        '',
        [Validators.required, Validators.pattern('^[1-9][0-9]*$')],
      ],
      pesoVacunas: [
        '',
        [Validators.pattern('^[0-9]+([,.][0-9]+)?$')],
      ],
      /*Datos de  la vacuna */
      vacunaCanino: [''],
      vacunaFelino: [''],
      laboratorioVacuna: ['', []],
      fechadeVacunacion: ['', [Validators.required]],
      fechadeREVacunacion: ['', [Validators.required]],
      precioVacunacion: [
        '',
        [Validators.required, Validators.pattern('^[0-9]+([,.][0-9]+)?$')],
      ],
    });
  }
  construirFormularioDesparacitacion() {
    this.formRegistrarDesparacitacion = this.formBuilder.group({
      /*Control medico */
      temperaturaDesparacitacion: [
        '',
        [Validators.required, Validators.pattern('^[1-9][0-9]*$')],
      ],
      frecuenciaCardiacaDesparacitacion: [
        '',
        [Validators.required, Validators.pattern('^[1-9][0-9]*$')],
      ],
      frecuenciaRespiratoriaDeparacitacion: [
        '',
        [Validators.required, Validators.pattern('^[1-9][0-9]*$')],
      ],
      pesoDesparacitacion: [
        '',
        [Validators.required, Validators.pattern('^[0-9]+([,.][0-9]+)?$')],
      ],
      /*Datos de  la desparacitacion */
      tipoDesparacitacion: ['', [Validators.required]],
      productoDesparacitacion: ['', [Validators.required]],
      principioActivo: ['', [Validators.required]],
      viaDesparacitacion: ['Oral', [Validators.required]],
      fechaDesparacitacion: ['', [Validators.required]],
      precioDesparasitacion: [
        '',
        [Validators.required, Validators.pattern('^[0-9]+([,.][0-9]+)?$')],
      ],
      fechaProximaAplicacionDespa: ['', [Validators.required]],
    });
  }
  construirFormularioCirugias() {
    this.formRegistrarCirugia = this.formBuilder.group({
      apetitoCirugia: [' ', []],
      aguaCirugia: [' ', []],
      conductaCirugia: [' ', []],
      defecacionCirugia: [' ', []],
      alteracionesNeuroCirugia: ['', []],
      problemasUrCirugia: [' ', []],
      alteracionesResCirugia: [' ', []],

      /*Control medico */
      temperaturaCirugia: [
        '',
        [Validators.required, Validators.pattern('^[1-9][0-9]*$')],
      ],
      frecuenciaCardiacaCirugia: [
        '',
        [Validators.required, Validators.pattern('^[1-9][0-9]*$')],
      ],
      frecuenciaRespiratoriaCirugia: [
        '',
        [Validators.required, Validators.pattern('^[1-9][0-9]*$')],
      ],
      pesoCirugia: [
        '',
        [Validators.required, Validators.pattern('^[0-9]+([,.][0-9]+)?$')],
      ],
      /*Datos de  la cirugia */
      tipoCirugia: ['', [Validators.required]],
      descripcionCirugia: ['', [Validators.required]],
      observacionesCirugia: ['', [Validators.required]],
      precioCirugia: [
        '',
        [Validators.required, Validators.pattern('^[0-9]+([,.][0-9]+)?$')],
      ],
      fechaCirugia: ['', [Validators.required]],
    });
  }
  async guardarDesparacitacion() {
    if (this.idMascota != null) {
      if (this.formRegistrarDesparacitacion.valid) {
        let controlFisicoEnviar: any = {
          temperatura: this.formRegistrarDesparacitacion.get(
            'temperaturaDesparacitacion'
          )?.value,
          frecCardiaca: this.formRegistrarDesparacitacion.get(
            'frecuenciaCardiacaDesparacitacion'
          )?.value,
          frecRespiratoria: this.formRegistrarDesparacitacion.get(
            'frecuenciaRespiratoriaDeparacitacion'
          )?.value,
          peso: this.formRegistrarDesparacitacion.get('pesoDesparacitacion')
            ?.value,
          idMascota: this.idMascota,
        };
        const idControlFisico = await this.registrarControlFisico(
          controlFisicoEnviar
        );
        let desparacitacionEnviar: any = {
          fecha_desparacitacion: this.formRegistrarDesparacitacion.get(
            'fechaDesparacitacion'
          )?.value,
          fecha_proxima_desparacitacion: this.formRegistrarDesparacitacion.get(
            'fechaProximaAplicacionDespa'
          )?.value,
          principio_activo:
            this.formRegistrarDesparacitacion.get('principioActivo')?.value,
          producto_desparacitacion: this.formRegistrarDesparacitacion.get(
            'productoDesparacitacion'
          )?.value,
          precio:
            this.formRegistrarDesparacitacion.get('precioDesparasitacion')?.value,

          tipo_desparacitacion: this.formRegistrarDesparacitacion.get(
            'tipoDesparacitacion'
          )?.value,
          via_desparacitcion:
            this.formRegistrarDesparacitacion.get('viaDesparacitacion')?.value,

          id_control_fisico: idControlFisico,
          id_mascota: this.idMascota,
        };
        console.log(desparacitacionEnviar);
        let respuesta = await this.consultasService.enviarCrearDesparacitacion(
          desparacitacionEnviar
        );
        if ((respuesta.statusCode = 200)) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se registro la desparacitacion',
            showConfirmButton: true,
            timer: 1500,
          });
          this.resetFormDes();
        }
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Debe seleccionar la mascota',
        showConfirmButton: true,
      });
    }
  }
  async guardarCirugia() {
    if (this.idMascota != null) {
      if (this.formRegistrarCirugia.valid) {
        let anamnesisEnviar: any = {
          apetito: this.formRegistrarCirugia.get('apetitoCirugia')?.value,
          agua: this.formRegistrarCirugia.get('aguaCirugia')?.value,
          conducta: this.formRegistrarCirugia.get('conductaCirugia')?.value,
          defecacion: this.formRegistrarCirugia.get('defecacionCirugia')?.value,
          alteracionesRes: this.formRegistrarCirugia.get(
            'alteracionesResCirugia'
          )?.value,
          alteracionesNeuro: this.formRegistrarCirugia.get(
            'alteracionesNeuroCirugia'
          )?.value,
          problemasUr:
            this.formRegistrarCirugia.get('problemasUrCirugia')?.value,
          idMascota: this.idMascota,
        };
        const idAnamnesis = await this.registrarAnamnesis(anamnesisEnviar);
        let controlFisicoEnviar: any = {
          temperatura:
            this.formRegistrarCirugia.get('temperaturaCirugia')?.value,
          frecCardiaca: this.formRegistrarCirugia.get(
            'frecuenciaCardiacaCirugia'
          )?.value,
          frecRespiratoria: this.formRegistrarCirugia.get(
            'frecuenciaRespiratoriaCirugia'
          )?.value,
          peso: this.formRegistrarCirugia.get('pesoCirugia')?.value,
          idMascota: this.idMascota,
        };
        const idControlFisico = await this.registrarControlFisico(
          controlFisicoEnviar
        );

        let cirugiaEnviar: any = {
          tipo_cirugia: this.formRegistrarCirugia.get('tipoCirugia')?.value,
          precio:this.formRegistrarCirugia.get('precioCirugia')?.value,
          descripcion_cirugia:
            this.formRegistrarCirugia.get('descripcionCirugia')?.value,
          observaciones_cirugia: this.formRegistrarCirugia.get(
            'observacionesCirugia'
          )?.value,
          fecha_cirugia: this.formRegistrarCirugia.get('fechaCirugia')?.value,
          id_anamnesis: idAnamnesis,
          id_control_fisico: idControlFisico,
          id_mascota: this.idMascota,
        };

        let respuesta = await this.consultasService.enviarCrearCirugia(
          cirugiaEnviar
        );
        if ((respuesta.statusCode = 200)) {
          this.resetFormCir();
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se registro la cirugia',
            showConfirmButton: true,
            timer: 1500,
          });
        } else {
          console.log(respuesta);
        }
      } else {
        console.log(this.formRegistrarConsulta.value);
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Debe seleccionar la mascota',
        showConfirmButton: true,
      });
    }
  }
  async guardarVacunas() {
    if (this.idMascota != null) {
      if (this.formRegistrarVacuna.valid) {
        let controlVacunaEnviar: any = {
          temperatura:
            this.formRegistrarVacuna.get('temperaturaVacunas')?.value,
          frecCardiaca: this.formRegistrarVacuna.get(
            'frecuenciaCardiacaVacunas'
          )?.value,
          frecRespiratoria: this.formRegistrarVacuna.get(
            'frecuenciaRespiratoriaVacunas'
          )?.value,
          peso: this.formRegistrarVacuna.get('pesoVacunas')?.value,
          precio:this.formRegistrarVacuna.get('pesoVaprecioVacuna')?.value,
          idMascota: this.idMascota,
        };
        const idControlFisico = await this.registrarControlFisico(
          controlVacunaEnviar
        );

        let vacunaEnviar: any = {
          descripcion_vacuna:
            this.formRegistrarVacuna.get('vacunaCanino')?.value ||
            this.formRegistrarVacuna.get('vacunaFelino')?.value,
          laboratorio: this.formRegistrarVacuna.get('laboratorioVacuna')?.value,
          fecha_vacunacion:
            this.formRegistrarVacuna.get('fechadeVacunacion')?.value,
          fecha_revacunacion: this.formRegistrarVacuna.get(
            'fechadeREVacunacion'
          )?.value,
          precio:this.formRegistrarVacuna.get('precioVacunacion')?.value,
          id_mascota: this.idMascota,
          id_control_fisico: idControlFisico,
        };
        let respuesta = await this.consultasService.enviarCrearVacuna(
          vacunaEnviar
        );
        if ((respuesta.statusCode = 200)) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se registro la vacuna',
            showConfirmButton: true,
            timer: 1500,
          });
          this.resetFormVac();
        }
      } else {
        console.log(this.formRegistrarConsulta.value);
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Debe seleccionar la mascota',
        showConfirmButton: true,
      });
    }
  }
  async guardarConsulta() {
    if (this.idMascota != null) {
      if (this.formRegistrarConsulta.valid) {
        console.log(this.formRegistrarConsulta.value);
        let anamnesisEnviar: any = {
          apetito: this.formRegistrarConsulta.get('apetito')?.value,
          agua: this.formRegistrarConsulta.get('agua')?.value,
          conducta: this.formRegistrarConsulta.get('conducta')?.value,
          defecacion: this.formRegistrarConsulta.get('defecacion')?.value,
          alteracionesRes:
            this.formRegistrarConsulta.get('alteracionesRes')?.value,
          alteracionesNeuro:
            this.formRegistrarConsulta.get('alteracionesNeuro')?.value,
          problemasUr: this.formRegistrarConsulta.get('problemasUr')?.value,
          idMascota: this.idMascota,
        };
        const idAnamnesis = await this.registrarAnamnesis(anamnesisEnviar);

        let controlFisicoEnviar: any = {
          temperatura: this.formRegistrarConsulta.get('temperaturaConsulta')
            ?.value,
          frecCardiaca: this.formRegistrarConsulta.get(
            'frecuenciaCardiacaConsulta'
          )?.value,
          frecRespiratoria: this.formRegistrarConsulta.get(
            'frecuenciaRespiratoriaConsulta'
          )?.value,
          peso: this.formRegistrarConsulta.get('pesoConsulta')?.value,
          idMascota: this.idMascota,
        };
        const idControlFisico = await this.registrarControlFisico(
          controlFisicoEnviar
        );
        let consultaEnviar: any = {
          motivo_consulta:
            this.formRegistrarConsulta.get('motivoConsulta')?.value,
          diagnostico_consulta: this.formRegistrarConsulta.get(
            'diagnosticoConsulta'
          )?.value,
          precio:this.formRegistrarConsulta.get('precioConsulta')?.value,
          tratamiento: this.formRegistrarConsulta.get('tratamiento')?.value,
          fecha_prox_visita:
            this.formRegistrarConsulta.get('proxVisita')?.value,
          fecha_registro_consulta:
            this.formRegistrarConsulta.get('fechaConsulta')?.value,
          id_anamnesis: idAnamnesis,
          id_control_fisico: idControlFisico,
          id_mascota: this.idMascota,
        };
        let respuesta = await this.consultasService.enviarCrearConsulta(
          consultaEnviar
        );
        if ((respuesta.statusCode = 200)) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se registro consulta',
            showConfirmButton: true,
            timer: 1500,
          });
          this.resetFormCon();
        }
      } else {
        console.log(this.formRegistrarConsulta.value);
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Debe seleccionar la mascota',
        showConfirmButton: true,
      });
    }
  }
  async registrarControlFisico(controlFisicoEnviar: any) {
    let respuesta = await this.consultasService.enviarCrearControlFisico(
      controlFisicoEnviar
    );

    return respuesta.datos.id_control_fisico;
  }

  async registrarAnamnesis(anamnesisEnviar: any) {
    let respuesta = await this.consultasService.enviarCrearAnamnesisService(
      anamnesisEnviar
    );
    return respuesta.datos.id_ananmnecis;
  }
  async seleccionarMascota(event: any) {
    const idMascotaSeleccionada = parseInt(event.target.value, 10);
    let respuesta = await this.mascotasService.listarMascotasServices(); // mandar el servicio
    this.listaMascotas = respuesta.datos;
    this.mascotaSeleccionada = this.listaMascotas.find(
      (mascota: any) => mascota.idMascota === idMascotaSeleccionada
    );
    this.idMascota = this.mascotaSeleccionada.idMascota;
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
  mostrarDetallesMascota(event: Event) {
    const idMascotaSeleccionada = (event.target as HTMLSelectElement).value;
    if (idMascotaSeleccionada) {
      const idMascota = parseInt(idMascotaSeleccionada, 10);
      //this.obtenerDetallesMascota(idMascota);
    } else {
      // Maneja el caso cuando no se ha seleccionado ninguna mascota
    }
  }
}
