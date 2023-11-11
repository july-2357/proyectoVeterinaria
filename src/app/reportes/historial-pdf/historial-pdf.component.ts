import { MascotasService } from 'src/app/services/mascotas.service';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ConsultasMService } from 'src/app/services/consultas-m.service';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-historial-pdf',
  templateUrl: './historial-pdf.component.html',
  styleUrls: ['./historial-pdf.component.css'],
})
export class HistorialPdfComponent implements OnInit {
  @ViewChild('reportContent') reportContent: ElementRef;
  datosMascota: any = {};

  listaConsultas: any = [];
  listaVacunas: any = [];
  listaDesparacitaciones: any = [];
  listaCirugias: any = [];
  // para los modales
  detalleVacuna: any;
  detalleDesparacitacion: any;
  detalleConsulta: any;
  detalleCirugia: any;
  vacunaSeleccionada: number | null = null;
  desparacitacionSeleccionada: number | null = null;
  consultaSeleccionada: number | null = null;
  cirugiaSeleccionada: number | null = null;
  idMascotaNumerico: number;
  listaMascotas: any = [];

  constructor(
    private mascotasService: MascotasService,
    private consultasService: ConsultasMService
  ) {}

  @Input() idMascota: number;

  ngOnInit(): void {
    this.obtenerMascotas();
    this.obtenerHistorial();
  }
  async obtenerMascotas() {
    const idMascotaSeleccionada = this.idMascota;
    let respuesta = await this.mascotasService.listarMascotasServices(); // mandar el servicio
    this.listaMascotas = respuesta.datos;
    this.datosMascota = this.listaMascotas.find(
      (mascota: any) => mascota.mascota.idMascota === idMascotaSeleccionada
    );
  }
  async obtenerHistorial() {
    try {
      const historial = await this.consultasService.obtenerHistorialMascota(
        this.idMascota
      );
      console.log(historial);
      if (historial && historial.datos) {
        this.listaConsultas = historial.datos?.listaConsultaMedica || [];
        this.listaVacunas = historial.datos?.listaVacunas || [];
        this.listaDesparacitaciones = historial.datos?.listaDesparaciones || [];
        this.listaCirugias = historial.datos?.listaCirugias || [];
      } else {
        console.warn('Datos de historial no válidos:', historial);
      }
    } catch (error) {
      console.error('Error al obtener el historial:', error);
    }
  }
  generarPDF() {
    const options = {
      margin: 10,
      filename: 'informe.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };
    const content = this.reportContent.nativeElement;
    html2pdf().from(content).set(options).save();
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
}
