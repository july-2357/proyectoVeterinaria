import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import * as html2pdf from 'html2pdf.js';
@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private options = {
    margin: 10,
    filename: 'informe.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };
  constructor() {}
  generarPDF(content: HTMLElement) {
    html2pdf()
      .from(content)
      .set(this.options)
      .outputPdf('datauristring')
      .then((pdfDataUri) => {
        const a = document.createElement('a');
        a.href = pdfDataUri;
        a.download = 'mi-documento.pdf';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
  }

  obtenerContenidoPorId(id: string): string | null {
    const elemento = document.getElementById(id);
    return elemento ? elemento.innerHTML : null;
  }
}
