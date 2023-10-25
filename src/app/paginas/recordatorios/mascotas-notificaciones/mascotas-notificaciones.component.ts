import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ConsultasMService } from 'src/app/services/consultas-m.service';
import { DuenosService } from 'src/app/services/duenos.service';
import { MascotasService } from 'src/app/services/mascotas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mascotas-notificaciones',
  templateUrl: './mascotas-notificaciones.component.html',
  styleUrls: ['./mascotas-notificaciones.component.css'],
})
export class MascotasNotificacionesComponent implements OnInit {
  listaConsultas: any = []; //lista general de consultas
  listaConsultasNotificaciones: any = []; //datos de las consultas sin mascotas
  listaMascotasConsultas: any = []; //datos de las mascotas para enviar el correo

  listaVacunas: any = [];
  listaVacunasNotificaciones: any = [];
  listaMascotasVacunas: any = [];

  listaDesparacitaciones: any = [];
  listaDesparacitacionesNotificaciones: any = [];
  listaMascotasDesparacitaciones: any = [];

  listaCirugias: any = [];
  listaMascotas: any = [];
  formEnviarCorreo: FormGroup;

  constructor(
    private consultas: ConsultasMService,
    private mascotasService: MascotasService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private duenosService: DuenosService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.obtenerVacunas();
    this.construirFormEnviarCorreo();
    this.obtenerConsultas();
    this.obtenerDesparacitaciones();
  }
  // Para las vacunas
  async obtenerVacunas() {
    try {
      console.log('Antes de obtener mascotas');
      await this.obtenerMascotas(); // Espera a que obtenerMascotas() se complete

      console.log('Después de obtener mascotas');
      let respuesta = await this.consultas.obtenerVacunas(); // mandar el servicio

      if (respuesta.statusCode === 200) {
        this.listaVacunas = respuesta.datos;

        for (let i = 0; i < this.listaVacunas.length; i++) {
          const fechaRevacunacion = new Date(
            this.listaVacunas[i].fecha_revacunacion
          );
          const fechaActual = new Date();
          const tresDiasAntes = new Date(fechaRevacunacion);
          tresDiasAntes.setDate(fechaRevacunacion.getDate() - 3);

          if (fechaActual >= tresDiasAntes && fechaActual < fechaRevacunacion) {
            this.listaVacunasNotificaciones.push(this.listaVacunas[i]);
            console.log('Enviar notificación' + this.listaVacunas[i].id_vacuna);
          }
        }

        for (let i = 0; i < this.listaVacunasNotificaciones.length; i++) {
          const idMascota = this.listaVacunasNotificaciones[i].id_mascota;
          const vacuna = this.listaVacunasNotificaciones[i];
          console.log(vacuna);
          const mascotaE = this.listaMascotas.find(
            (mascota) => mascota.idMascota === idMascota
          );
          console.log(mascotaE);
          const param = {
            idMascota: mascotaE.idMascota,
            color: mascotaE.color,
            fecha_nacimiento: mascotaE.fecha_nacimiento,
            nombreMascota: mascotaE.nombreMascota,
            sexo: mascotaE.sexo,
            tatuaje: mascotaE.tatuaje,
            conducta: mascotaE.conducta,
            foto: mascotaE.foto,
            idDueno: mascotaE.idDueno,
            idRaza: mascotaE.idRaza,
            dueno: {
              idDuenos: mascotaE.dueno.idDuenos,
              nombres: mascotaE.dueno.nombres,
              apellidoPaterno: mascotaE.dueno.apellidoPaterno,
              apellidoMaterno: mascotaE.dueno.apellidoMaterno,
              telefono: mascotaE.dueno.telefono,
              correo: mascotaE.dueno.correo,
              direccion: mascotaE.dueno.direccion,
            },
            raza: {
              idRaza: mascotaE.raza.idRaza,
              descripcion: mascotaE.raza.descripcion,
              idEspecie: mascotaE.raza.idEspecie,
            },

            vacuna: {
              id_vacuna: vacuna.id_vacuna,
              descripcion_vacuna: vacuna.descripcion_vacuna,
              laboratorio: vacuna.laboratorio,
              fecha_vacunacion: vacuna.fecha_vacunacion,
              fecha_revacunacion: vacuna.fecha_revacunacion,
              id_control_fisico: vacuna.id_control_fisico,
            },
          };
          this.listaMascotasVacunas.push(param);
        }
        console.log(this.listaMascotasVacunas);
      }
    } catch (error) {
      console.error(error);
    }
  }
  //Para las consultas
  async obtenerConsultas() {
    try {
      await this.obtenerMascotas(); // Espera a que obtenerMascotas() se complete
      let respuesta = await this.consultas.obtenerConsultas(); // mandar el servicio
      if (respuesta.statusCode === 200) {
        this.listaConsultas = respuesta.datos;
        for (let i = 0; i < this.listaConsultas.length; i++) {
          const fechaReconsulta = new Date(
            this.listaConsultas[i].fecha_prox_visita
          );
          const fechaActual = new Date();
          const tresDiasAntes = new Date(fechaReconsulta);
          tresDiasAntes.setDate(fechaReconsulta.getDate() - 3);

          if (fechaActual >= tresDiasAntes && fechaActual < fechaReconsulta) {
            this.listaConsultasNotificaciones.push(this.listaConsultas[i]);
          }
        }
        console.log(this.listaConsultasNotificaciones);

        for (let i = 0; i < this.listaConsultasNotificaciones.length; i++) {
          const idMascota = this.listaConsultasNotificaciones[i].id_mascota;
          const consulta = this.listaConsultasNotificaciones[i];

          const mascotaE = this.listaMascotas.find(
            (mascota) => mascota.idMascota === idMascota
          );

          const param = {
            idMascota: mascotaE.idMascota,
            color: mascotaE.color,
            fecha_nacimiento: mascotaE.fecha_nacimiento,
            nombreMascota: mascotaE.nombreMascota,
            sexo: mascotaE.sexo,
            tatuaje: mascotaE.tatuaje,
            conducta: mascotaE.conducta,
            foto: mascotaE.foto,
            idDueno: mascotaE.idDueno,
            idRaza: mascotaE.idRaza,
            dueno: {
              idDuenos: mascotaE.dueno.idDuenos,
              nombres: mascotaE.dueno.nombres,
              apellidoPaterno: mascotaE.dueno.apellidoPaterno,
              apellidoMaterno: mascotaE.dueno.apellidoMaterno,
              telefono: mascotaE.dueno.telefono,
              correo: mascotaE.dueno.correo,
              direccion: mascotaE.dueno.direccion,
            },
            raza: {
              idRaza: mascotaE.raza.idRaza,
              descripcion: mascotaE.raza.descripcion,
              idEspecie: mascotaE.raza.idEspecie,
            },

            consulta: {
              id_consulta_medica: consulta.id_consulta_medica,
              motivo_consulta: consulta.motivo_consulta,
              diagnostico_consulta: consulta.diagnostico_consulta,
              tratamiento: consulta.tratamiento,
              fecha_prox_visita: consulta.fecha_prox_visita,
              fecha_registro_consulta: consulta.fecha_registro_consulta,
            },
          };
          this.listaMascotasConsultas.push(param);
        }
        console.log(this.listaMascotasConsultas);
      }
    } catch (error) {
      console.error(error);
    }
  }
  //Para las desparacitaciones
  async obtenerDesparacitaciones() {
    try {
      // listaDesparacitaciones: any = [];
      // listaDesparacitacionesNotificaciones: any = [];
      // listaMascotasDesparacitaciones: any = [];

      await this.obtenerMascotas(); // Espera a que obtenerMascotas() se complete
      let respuesta = await this.consultas.obtenerDesparacitaciones(); // mandar el servicio
      if (respuesta.statusCode === 200) {
        this.listaDesparacitaciones = respuesta.datos;
        for (let i = 0; i < this.listaDesparacitaciones.length; i++) {
          const fechaReconsulta = new Date(
            this.listaDesparacitaciones[i].fecha_proxima_desparacitacion
          );
          const fechaActual = new Date();
          const tresDiasAntes = new Date(fechaReconsulta);
          tresDiasAntes.setDate(fechaReconsulta.getDate() - 3);

          if (fechaActual >= tresDiasAntes && fechaActual < fechaReconsulta) {
            this.listaDesparacitacionesNotificaciones.push(
              this.listaDesparacitaciones[i]
            );
          }
        }
        console.log(this.listaDesparacitacionesNotificaciones);

        for (
          let i = 0;
          i < this.listaDesparacitacionesNotificaciones.length;
          i++
        ) {
          const idMascota =
            this.listaDesparacitacionesNotificaciones[i].id_mascota;
          const despara = this.listaDesparacitacionesNotificaciones[i];

          const mascotaE = this.listaMascotas.find(
            (mascota) => mascota.idMascota === idMascota
          );

          const param = {
            idMascota: mascotaE.idMascota,
            color: mascotaE.color,
            fecha_nacimiento: mascotaE.fecha_nacimiento,
            nombreMascota: mascotaE.nombreMascota,
            sexo: mascotaE.sexo,
            tatuaje: mascotaE.tatuaje,
            conducta: mascotaE.conducta,
            foto: mascotaE.foto,
            idDueno: mascotaE.idDueno,
            idRaza: mascotaE.idRaza,
            dueno: {
              idDuenos: mascotaE.dueno.idDuenos,
              nombres: mascotaE.dueno.nombres,
              apellidoPaterno: mascotaE.dueno.apellidoPaterno,
              apellidoMaterno: mascotaE.dueno.apellidoMaterno,
              telefono: mascotaE.dueno.telefono,
              correo: mascotaE.dueno.correo,
              direccion: mascotaE.dueno.direccion,
            },
            raza: {
              idRaza: mascotaE.raza.idRaza,
              descripcion: mascotaE.raza.descripcion,
              idEspecie: mascotaE.raza.idEspecie,
            },

            desparacitacion: {
              id_desparacitacion: despara.id_desparacitacion,
              fecha_desparacitacion: despara.fecha_desparacitacion,
              fecha_proxima_desparacitacion:
                despara.fecha_proxima_desparacitacion,
              principio_activo: despara.principio_activo,
              producto_desparacitacion: despara.producto_desparacitacion,
              tipo_desparacitacion: despara.tipo_desparacitacion,
              via_desparacitcion: despara.via_desparacitcion,
            },
          };
          this.listaMascotasDesparacitaciones.push(param);
        }
        console.log(this.listaMascotasDesparacitaciones);
      }
    } catch (error) {
      console.error(error);
    }
  }
  async obtenerCirugias() {
    try {
      let respuesta = await this.consultas.obtenerCirugias(); // mandar el servicio
      if ((respuesta.statusCode = 200)) {
        this.listaCirugias = respuesta.datos;
        console.log(this.listaCirugias);
      }
    } catch (error) {
      console.log('error');
    }
  }
  async obtenerMascotas() {
    try {
      let respuesta = await this.mascotasService.listarMascotasServices();
      if (respuesta.statusCode === 200) {
        this.listaMascotas = respuesta.datos;
      }
    } catch (error) {
      console.log('Error al obtener mascotas:', error);
      throw error; // Lanza el error nuevamente para que pueda ser manejado en el método que llama a obtenerMascotas
    }
  }

  construirFormEnviarCorreo() {
    // this.formEnviarCorreo.patchValue({
    //   correoElectronico: this.detalleMascotas.nombreMascota,})
    this.formEnviarCorreo = this.formBuilder.group({
      correoElectronico: ['', [Validators.required]],
      asuntoCorreo: ['', [Validators.required]],
      mensaje: ['', [Validators.required]],
    });
  }
  async abrirModalCorreoVacunas(mascota: any) {
    this.formEnviarCorreo.patchValue({
      correoElectronico: mascota.dueno.correo,
      asuntoCorreo:
        'Recordatorio de próxima vacuna para ' + mascota.nombreMascota,
      mensaje: `
      <p>Estimado/a ${mascota.dueno.nombres} ${mascota.dueno.apellidoPaterno},</p>

      <p>Espero que tanto usted como su mascota ${mascota.nombreMascota} estén disfrutando de buena salud.</p>

      <p>Queremos recordarle la fecha de la próxima desparacitación programada para el ${mascota.vacuna.fecha_revacunacion}.</p>

      <p>Asegúrese de tener esta fecha agendada para garantizar la salud de su mascota.</p>

      <p>Gracias por confiar en nosotros para el cuidado de su mascota.</p>

      <p>Atentamente,</p>

      <p>Veterinaria My Puppy Planet</p>

      <p>2500063</p>
    `,
    });
  }
  async abrirModalCorreoDespa(mascota: any) {
    this.formEnviarCorreo.patchValue({
      correoElectronico: mascota.dueno.correo,
      asuntoCorreo:
        'Recordatorio de próxima desparasitación para ' + mascota.nombreMascota,
        mensaje: this.sanitizer.bypassSecurityTrustHtml(`Estimado/a ${mascota.dueno.nombres} ${mascota.dueno.apellidoPaterno},<br/><br/>
        <b>aaaaa</b> Espero que tanto usted como su mascota ${mascota.nombreMascota} estén disfrutando de buena salud. Queremos recordarle la fecha de la próxima desparasitación programada para el ${mascota.desparacitacion.fecha_proxima_desparacitacion}.<br/>
        Asegúrese de tener esta fecha agendada para garantizar la salud de su mascota.<br/>
        Gracias por confiar en nosotros para el cuidado de su mascota.<br/><br/>
        Atentamente,<br/>
        Veterinaria My Puppy Planet<br/>
        2500063`),
    });
  }
  stripHTMLTags(html: string): string {
    const temporalDivElement = document.createElement('div');
    temporalDivElement.innerHTML = html;
    return temporalDivElement.textContent || temporalDivElement.innerText || '';
  }
  async abrirModalCorreoConsultas(mascota: any) {
    this.formEnviarCorreo.patchValue({
      correoElectronico: mascota.dueno.correo,
      asuntoCorreo:
        'Recordatorio de próxima consulta para ' + mascota.nombreMascota,
      mensaje: `Estimado/a ${mascota.dueno.nombres} ${mascota.dueno.apellidoPaterno},

    Espero que tanto usted como su mascota ${mascota.nombreMascota} estén disfrutando de buena salud. Queremos recordarle la fecha de la próxima consulta programada para el ${mascota.consulta.fecha_prox_visita}.
     Asegúrese de tener esta fecha agendada para garantizar la salud de su mascota.
     Gracias por confiar en nosotros para el cuidado de su mascota.

    Atentamente,

    Veterinaria My Puppy Planet
    2500063`,
    });
  }
  async enviarCorreo() {
    if (this.formEnviarCorreo.valid) {
      let correoEnviar: any = {
        correoDestinatrio:
          this.formEnviarCorreo.get('correoElectronico')?.value,
        asunto: this.formEnviarCorreo.get('asuntoCorreo')?.value,
        cuerpo: this.formEnviarCorreo.get('mensaje')?.value,
      };
      console.log(correoEnviar);
      let respuesta = await this.duenosService.enviarCorreo(correoEnviar);
      if ((respuesta.statusCode = 200)) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se envio el correo',
          showConfirmButton: true,
          timer: 1500,
        });
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
      alert('Formulario Invalido');
      console.log(this.formEnviarCorreo.value);
    }
  }
}
