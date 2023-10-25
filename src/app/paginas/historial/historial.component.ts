import { ActualizarMascotaComponent } from './../mascotas/actualizar-mascota/actualizar-mascota.component';
import { Component, OnInit } from '@angular/core';
import { ConsultasMService } from 'src/app/services/consultas-m.service';
import { EnviarDatosService } from 'src/app/services/enviar-datos.service';
import { MascotasService } from 'src/app/services/mascotas.service';
import { ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css'],
})
export class HistorialComponent implements OnInit {
  @ViewChild(ActualizarMascotaComponent) actualizarMascota: ActualizarMascotaComponent;
  datosMascota: any = {};
  listaConsultas: any = [];
  listaVacunas: any = [];
  listaDesparacitaciones: any = [];
  listaCirugias: any = [];
  // para los modales
  detalleVacuna: any;
  detalleDesparacitacion: any;
  detalleConsulta: any;
  detalleCirugia:any;
  vacunaSeleccionada: number | null = null;
  desparacitacionSeleccionada: number | null = null;
  consultaSeleccionada: number | null = null;
  cirugiaSeleccionada: number | null = null;
  idMascotaNumerico: number;
  listaMascotas: any=[];
  datos:any;
  constructor(
    private consultasService: ConsultasMService,
    private mascotasService: MascotasService,
private cookieService:CookieService
  ) {}

  ngOnInit(): void {
    const idMascota = localStorage.getItem('idMascotaHistorial'); // Reemplaza con el ID de la mascota que deseas obtener
      if (idMascota !== null) {
        this.idMascotaNumerico = parseInt(idMascota, 10);}
    this.obtenerHistorial();
    this.obtenerMascotas();

  }
  async obtenerMascotas() {
    const idMascotaSeleccionada = this.idMascotaNumerico;
    let respuesta = await this.mascotasService.listarMascotasServices(); // mandar el servicio
    this.listaMascotas = respuesta.datos;
    this.datos = this.listaMascotas.find(
      (mascota: any) => mascota.idMascota === idMascotaSeleccionada
    );
      }
  async obtenerHistorial() {
    try {
         const historial = await this.consultasService.obtenerHistorialMascota(
        this.idMascotaNumerico
      );
      if (historial && historial.datos) {
        this.listaConsultas = historial.datos.listaConsultaMedica || [];
        this.listaVacunas = historial.datos.listaVacunas || [];
        this.listaDesparacitaciones = historial.datos.listaDesparaciones || [];
        this.listaCirugias= historial.datos.listaCirugias || [];
        console.log(this.listaCirugias);
      } else {
        console.warn('Datos de historial no válidos:', historial);
      }
    }
     catch (error) {
      console.error('Error al obtener el historial:', error);
    }
  }
  calcularEdad(fechaNacimiento: string): { anios: number; meses: number } {
    // Obtener la fecha de nacimiento como objeto Date directamente desde la cadena de fecha
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
  openModalVacunas(itemId: number) {
    this.vacunaSeleccionada = itemId;
    this.detalleVacuna = this.listaVacunas.find(
      (vacuna: any) => vacuna.id_vacuna === this.vacunaSeleccionada
    );
    console.log(this.detalleVacuna);
  }
  openModalDesparacitaciones(itemId: number) {
    this.desparacitacionSeleccionada = itemId;
    this.detalleDesparacitacion = this.listaDesparacitaciones.find(
      (desparacitacion: any) => desparacitacion.id_desparacitacion === this.desparacitacionSeleccionada
    );
    console.log(this.detalleDesparacitacion);
  }
  openModalConsultas(itemId: number) {
    this.consultaSeleccionada = itemId;
    this.detalleConsulta = this.listaConsultas.find(
      (consulta: any) => consulta.id_consulta_medica === this.consultaSeleccionada
    );
    console.log(this.detalleConsulta);
  }
  openModalCirugias(itemId: number) {
    this.cirugiaSeleccionada = itemId;
    this.detalleCirugia = this.listaCirugias.find(
      (cirugia: any) => cirugia.id_cirugia === this.cirugiaSeleccionada
    );
    console.log(this.detalleCirugia);
  }
  esRol(rol: string): boolean {
    const roles = this.cookieService.get('rol');
    return roles === rol;
  }
}
