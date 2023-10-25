import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import * as html2pdf from 'html2pdf.js';

import { DuenosService } from 'src/app/services/duenos.service';
import { PdfService } from 'src/app/services/pdf.service';

@Component({
  selector: 'app-duenos-pdf',
  templateUrl: './duenos-pdf.component.html',
  styleUrls: ['./duenos-pdf.component.css'],
})
export class DuenosPdfComponent implements OnInit {
  @Input() idDuenoPDF: number | undefined;

  @ViewChild('reportContent') reportContent: ElementRef;
  listaMascotas: any = [];
  datosDueno: any;
  constructor(private duenosService: DuenosService, private pdfService: PdfService) {}

  ngOnInit(): void {
    this.mostrarDatosDuenoyMascotas();
// this.generarPDF();
  }

  generarPDF2() {
    const content = this.reportContent.nativeElement;
    this.pdfService.generarPDF(content);
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
}
