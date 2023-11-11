import { EnviarDatosService } from './../../services/enviar-datos.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MascotasService } from 'src/app/services/mascotas.service';
import { ConsultasMService } from 'src/app/services/consultas-m.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
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
  verPrecioVError = false;

  //errores de consultas
  verTempCError = false;
  verFCCError = false;
  verFRCError = false;
  verPesoCError = false;
  verPrecioCError = false;
  //errores de desparacitaciones
  verTempDError = false;
  verFCDError = false;
  verFRDError = false;
  verPesoDError = false;
  verPrecioDError = false;
  //errores de cirugias
  verTempCiError = false;
  verFCCiError = false;
  verFRCiError = false;
  verPesoCiError = false;
  verPrecioCiError = false;

  //Para obtenet la fecha actual
  currentDate: string;
  constructor(
    private formBuilder: FormBuilder,
    private consultasService: ConsultasMService,
    private enviarDatosService: EnviarDatosService,
    private mascotasService: MascotasService,
    private toastr: ToastrService,private router:Router
  ) {}

  ngOnInit(): void {
    if (this.enviarDatosService.getDatos() != null) {
      this.datosMascota = this.enviarDatosService.getDatos();
      console.log(this.datosMascota);
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
    this.formRegistrarVacuna.reset();
    this.verTempVError = false;
    this.verFCVError = false;
    this.verFRVError = false;
    this.verPesoVError = false;
    this.verPrecioVError = false;
  }
  resetFormCon() {
    this.formRegistrarConsulta.reset();
    this.verTempCError = false;
    this.verFCCError = false;
    this.verFRCError = false;
    this.verPesoCError = false;
    this.verPrecioCError = false;
  }
  resetFormDes() {
    this.formRegistrarDesparacitacion.reset();
    this.verTempDError = false;
    this.verFCDError = false;
    this.verFRDError = false;
    this.verPesoDError = false;
    this.verPrecioDError = false;
  }
  resetFormCir() {
    this.formRegistrarCirugia.reset();
    this.verTempCiError = false;
    this.verFCCiError = false;
    this.verFRCiError = false;
    this.verPesoCiError = false;
    this.verPrecioCiError = false;
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
        [
          Validators.required,
          Validators.pattern('^(?!0*[.,]?0*$)\\d+(?:[.,]\\d+)?$'),
        ],
      ],
      /*Consulta medica */
      motivoConsulta: ['', [Validators.required]],
      diagnosticoConsulta: ['', [Validators.required]],
      tratamiento: ['', [Validators.required]],
      fechaConsulta: ['', [Validators.required]],
      proxVisita: [''],
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
      pesoVacunas: ['', [Validators.pattern('^[0-9]+([,.][0-9]+)?$')]],
      /*Datos de  la vacuna */
      vacunaCanino: [''],
      vacunaFelino: [''],
      laboratorioVacuna: ['', []],
      fechadeVacunacion: ['', [Validators.required]],
      fechadeREVacunacion: [' '],
      precioVacunacion: [
        '',
        [
          Validators.required,
          Validators.pattern('^(?!0*[.,]?0*$)\\d+(?:[.,]\\d+)?$'),
        ],
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
        [
          Validators.required,
          Validators.pattern('^(?!0*[.,]?0*$)\\d+(?:[.,]\\d+)?$'),
        ],
      ],
      fechaProximaAplicacionDespa: [''],
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
        [
          Validators.required,
          Validators.pattern('^(?!0*[.,]?0*$)\\d+(?:[.,]\\d+)?$'),
        ],
      ],
      fechaCirugia: ['', [Validators.required]],
    });
  }
  async guardarDesparacitacion() {
    if (this.idMascota != null) {
      if (this.formRegistrarDesparacitacion.valid) {
        var fechaDesparacitacion = new Date(
          this.formRegistrarDesparacitacion.get('fechaDesparacitacion')?.value
        );
        var fechaProximaAplicacionDespa = new Date(
          this.formRegistrarDesparacitacion.get(
            'fechaProximaAplicacionDespa'
          )?.value
        );
        const fechaActual = new Date();
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
        if (!fechaProximaAplicacionDespa) {
          if (
            fechaDesparacitacion <= fechaActual &&
            fechaDesparacitacion <
              new Date(
                this.formRegistrarDesparacitacion.get(
                  'fechaProximaAplicacionDespa'
                )?.value
              )
          ) {
            const idControlFisico = await this.registrarControlFisico(
              controlFisicoEnviar
            );
            let desparacitacionEnviar: any = {
              fecha_desparacitacion: this.formRegistrarDesparacitacion.get(
                'fechaDesparacitacion'
              )?.value,
              fecha_proxima_desparacitacion:
                this.formRegistrarDesparacitacion.get(
                  'fechaProximaAplicacionDespa'
                )?.value,
              principio_activo: this.formRegistrarDesparacitacion
                .get('principioActivo')
                ?.value.toUpperCase(),
              producto_desparacitacion: this.formRegistrarDesparacitacion
                .get('productoDesparacitacion')
                ?.value.toUpperCase(),
              precio: this.formRegistrarDesparacitacion.get(
                'precioDesparasitacion'
              )?.value,

              tipo_desparacitacion: this.formRegistrarDesparacitacion
                .get('tipoDesparacitacion')
                ?.value.toUpperCase(),
              via_desparacitcion: this.formRegistrarDesparacitacion
                .get('viaDesparacitacion')
                ?.value.toUpperCase(),
              id_control_fisico: idControlFisico,
              id_mascota: this.idMascota,
            };
            let respuesta =
              await this.consultasService.enviarCrearDesparacitacion(
                desparacitacionEnviar
              );
            if ((respuesta.statusCode = 200)) {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Se registro desparacitación',
                showConfirmButton: false,
                width: '350px',
                timer: 1500,
              });
              this.resetFormDes();
            }
          } else if (
            fechaDesparacitacion >
            new Date(
              this.formRegistrarDesparacitacion.get(
                'fechaProximaAplicacionDespa'
              )?.value
            )
          ) {
            Swal.fire({
              icon: 'error',
              title: 'Error en las fechas',
              text: 'La fecha de próxima desparasitación debe ser posterior a la fecha de desparasitación actual.',
              showCancelButton: false,
              showConfirmButton: true,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Entendido',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error en la fecha de desparasitación',
              text: 'La fecha de desparasitación debe ser menor o igual a la fecha actual.',
              showCancelButton: false,
              showConfirmButton: true,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Entendido',
            });
          }
        } else {
          const idControlFisico = await this.registrarControlFisico(
            controlFisicoEnviar
          );
          let desparacitacionEnviar: any = {
            fecha_desparacitacion: this.formRegistrarDesparacitacion.get(
              'fechaDesparacitacion'
            )?.value,
            fecha_proxima_desparacitacion:
              this.formRegistrarDesparacitacion.get(
                'fechaProximaAplicacionDespa'
              )?.value,
            principio_activo:
              this.formRegistrarDesparacitacion.get('principioActivo')?.value,
            producto_desparacitacion: this.formRegistrarDesparacitacion
              .get('productoDesparacitacion')
              ?.value.toUpperCase(),
            precio: this.formRegistrarDesparacitacion.get(
              'precioDesparasitacion'
            )?.value,

            tipo_desparacitacion: this.formRegistrarDesparacitacion
              .get('tipoDesparacitacion')
              ?.value.toUpperCase(),
            via_desparacitcion: this.formRegistrarDesparacitacion
              .get('viaDesparacitacion')
              ?.value.toUpperCase(),
            id_control_fisico: idControlFisico,
            id_mascota: this.idMascota,
          };
          let respuesta =
            await this.consultasService.enviarCrearDesparacitacion(
              desparacitacionEnviar
            );
          if ((respuesta.statusCode = 200)) {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Se registro desparasitación',
              showConfirmButton: false,
              width: '350px',
              timer: 1500,
            });
            this.resetFormDes();
          }
        }
      }
    } else {
      this.toastr.error('De bebe seleccionar una mascota', 'Revise los datos!');
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
          tipo_cirugia: this.formRegistrarCirugia
            .get('tipoCirugia')
            ?.value.toUpperCase(),
          precio: this.formRegistrarCirugia.get('precioCirugia')?.value,
          descripcion_cirugia: this.formRegistrarCirugia
            .get('descripcionCirugia')
            ?.value.toUpperCase(),
          observaciones_cirugia: this.formRegistrarCirugia
            .get('observacionesCirugia')
            ?.value.toUpperCase(),
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
            title: 'Se registro cirugía',
            showConfirmButton: false,
            width: '350px',
            timer: 1500,
          });
        } else {
          console.log(respuesta);
        }
      } else {
        console.log(this.formRegistrarConsulta.value);
      }
    } else {
      this.toastr.error('De bebe seleccionar una mascota', 'Revise los datos!');
    }
  }
  async guardarVacunas() {
    if (this.idMascota != null) {
      if (this.formRegistrarVacuna.valid) {
        const fechaVacunacion = new Date(
          this.formRegistrarVacuna.get('fechadeVacunacion')?.value
        );
        const fechaProximaAplicacionVacuna = new Date(
          this.formRegistrarVacuna.get('fechadeREVacunacion')?.value
        );
        const fechaActual = new Date();
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
          precio: this.formRegistrarVacuna.get('pesoVaprecioVacuna')?.value,
          idMascota: this.idMascota,
        };
        if (!fechaProximaAplicacionVacuna) {
          if (
            fechaVacunacion <= fechaActual &&
            fechaVacunacion <
              new Date(
                this.formRegistrarVacuna.get('fechadeREVacunacion')?.value
              )
          ) {
            const idControlFisico = await this.registrarControlFisico(
              controlVacunaEnviar
            );

            let vacunaEnviar: any = {
              descripcion_vacuna:
                this.formRegistrarVacuna
                  .get('vacunaCanino')
                  ?.value.toUpperCase() ||
                this.formRegistrarVacuna
                  .get('vacunaFelino')
                  ?.value.toUpperCase(),
              laboratorio: this.formRegistrarVacuna
                .get('laboratorioVacuna')
                ?.value.toUpperCase(),
              fecha_vacunacion:
                this.formRegistrarVacuna.get('fechadeVacunacion')?.value,
              fecha_revacunacion: this.formRegistrarVacuna.get(
                'fechadeREVacunacion'
              )?.value,
              precio: this.formRegistrarVacuna.get('precioVacunacion')?.value,
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
                showConfirmButton: false,
                width: '350px',
                timer: 1500,
              });
              this.resetFormVac();
            }
          } else if (
            fechaVacunacion >
            new Date(this.formRegistrarVacuna.get('fechadeREVacunacion')?.value)
          ) {
            Swal.fire({
              icon: 'error',
              title: 'Error en las fechas',
              text: 'La fecha de próxima vacuna debe ser posterior a la fecha de vacunación actual.',
              showCancelButton: false,
              showConfirmButton: true,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Entendido',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error en la fecha de Vacunación',
              text: 'La fecha de vacunación debe ser menor o igual a la fecha actual.',
              showCancelButton: false,
              showConfirmButton: true,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Entendido',
            });
          }
        } else {
          const idControlFisico = await this.registrarControlFisico(
            controlVacunaEnviar
          );

          let vacunaEnviar: any = {
            descripcion_vacuna:
              this.formRegistrarVacuna
                .get('vacunaCanino')
                ?.value.toUpperCase() ||
              this.formRegistrarVacuna.get('vacunaFelino')?.value.toUpperCase(),
            laboratorio: this.formRegistrarVacuna
              .get('laboratorioVacuna')
              ?.value.toUpperCase(),
            fecha_vacunacion:
              this.formRegistrarVacuna.get('fechadeVacunacion')?.value,
            fecha_revacunacion: this.formRegistrarVacuna.get(
              'fechadeREVacunacion'
            )?.value,
            precio: this.formRegistrarVacuna.get('precioVacunacion')?.value,
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
              showConfirmButton: false,
              width: '350px',
              timer: 1500,
            });
            this.resetFormVac();
          }
        }
      }
    } else {
      this.toastr.error('De bebe seleccionar una mascota', 'Revise los datos!');
    }
  }
  async guardarConsulta() {
    if (this.idMascota != null) {
      if (this.formRegistrarConsulta.valid) {
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
        var fechaConsulta = new Date(
          this.formRegistrarConsulta.get('fechaConsulta')?.value
        );
        var fechaProximaConsulta = new Date(
          this.formRegistrarConsulta.get('proxVisita')?.value
        );
        var fechaActual = new Date(); // Obtener la fecha actual
        if (!fechaProximaConsulta) {
          if (
            fechaConsulta <= fechaActual &&
            fechaConsulta <
              new Date(this.formRegistrarConsulta.get('proxVisita')?.value)
          ) {
            const idAnamnesis = await this.registrarAnamnesis(anamnesisEnviar);
            const idControlFisico = await this.registrarControlFisico(
              controlFisicoEnviar
            );
            let consultaEnviar: any = {
              motivo_consulta: this.formRegistrarConsulta
                .get('motivoConsulta')
                ?.value.toUpperCase(),
              diagnostico_consulta: this.formRegistrarConsulta
                .get('diagnosticoConsulta')
                ?.value.toUpperCase(),
              precio: this.formRegistrarConsulta.get('precioConsulta')?.value,
              tratamiento: this.formRegistrarConsulta
                .get('tratamiento')
                ?.value.toUpperCase(),
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
                showConfirmButton: false,
                width: '350px',
                timer: 1500,
              });
              this.resetFormCon();
            }
          } else if (
            fechaConsulta >
            new Date(this.formRegistrarConsulta.get('proxVisita')?.value)
          ) {
            Swal.fire({
              icon: 'error',
              title: 'Error en las fechas',
              text: 'La fecha de próxima visita debe ser posterior a la fecha de consulta.',
              showCancelButton: false,
              showConfirmButton: true,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Entendido',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error en la Fecha Consulta',
              text: 'La fecha de consulta debe ser menor o igual a la fecha actual.',
              showCancelButton: false,
              showConfirmButton: true,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Entendido',
            });
          }
        } else {
          const idAnamnesis = await this.registrarAnamnesis(anamnesisEnviar);
          const idControlFisico = await this.registrarControlFisico(
            controlFisicoEnviar
          );
          let consultaEnviar: any = {
            motivo_consulta: this.formRegistrarConsulta
              .get('motivoConsulta')
              ?.value.toUpperCase(),
            diagnostico_consulta: this.formRegistrarConsulta
              .get('diagnosticoConsulta')
              ?.value.toUpperCase(),
            precio: this.formRegistrarConsulta.get('precioConsulta')?.value,
            tratamiento: this.formRegistrarConsulta
              .get('tratamiento')
              ?.value.toUpperCase(),
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
              showConfirmButton: false,
              width: '350px',
              timer: 1500,
            });
            this.resetFormCon();
          }
        }
      }
    } else {
      this.toastr.error('De bebe seleccionar una mascota', 'Revise los datos!');
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
      (mascota: any) => mascota.mascota.idMascota === idMascotaSeleccionada
    );
    console.log(this.mascotaSeleccionada);
    this.mascotaSeleccionada = this.mascotaSeleccionada.mascota;
    this.idMascota = this.mascotaSeleccionada?.idMascota;
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
      let respuesta = await this.mascotasService.listarMascotasServices(); // mandar el servicio

      if ((respuesta.statusCode = 200)) {
        this.listaMascotas = respuesta.datos;
      }
    } catch (error) {}
  }
  mostrarDetallesMascota(event: Event) {
    const idMascotaSeleccionada = (event.target as HTMLSelectElement).value;
    if (idMascotaSeleccionada) {
      const idMascota = parseInt(idMascotaSeleccionada, 10);
    } else {
      console.log('No se selecciono mascota');
    }
  }

  navegarVentanaHistorial(mascota: any) {
    localStorage.setItem('idMascotaHistorial', mascota.idMascota);
    localStorage.setItem('idDuenoHistorial', mascota.idDueno);
    this.router.navigate(['/principal/historial']);
  }
}
