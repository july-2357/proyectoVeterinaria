import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MascotasService } from 'src/app/services/mascotas.service';
import * as html2pdf from 'html2pdf.js';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-lista-mascotas-pdf',
  templateUrl: './lista-mascotas-pdf.component.html',
  styleUrls: ['./lista-mascotas-pdf.component.css'],
})
export class ListaMascotasPdfComponent implements OnInit {
  @ViewChild('reportContent') reportContent: ElementRef;
  datosUsuario: any = {};
  listaDesparacitaciones: any = [];
  fechaFormateada:any;
  listaMascotas: any = [];
  constructor(
    private mascotasService: MascotasService,
    private usuariosSevice: UsuariosService
  ) {}

  ngOnInit(): void {
    this.obtenerMascotas();
    this.mostrarDatosUsuario();
  }
  async obtenerMascotas() {
    let respuesta = await this.mascotasService.listarMascotasServices(); // mandar el servicio
    const fechaHora = respuesta.fechaConsulta;
    const fechaHoraObj = new Date(fechaHora);
    this.fechaFormateada = fechaHoraObj.toISOString().split("T")[0];
    this.listaMascotas = respuesta.datos;
  }
  async mostrarDatosUsuario() {
    try {
      let usuario = localStorage.getItem('idLoginUsuario');
      if (usuario !== null) {
        usuario = usuario.toString();
        let respuesta = await this.usuariosSevice.listarUsuariosService(
          usuario
        ); // mandar el servicio
        if ((respuesta.statusCode = 200)) {
          this.datosUsuario = respuesta.datos[0];
          console.log(this.datosUsuario);
        }
      }
    } catch (error) {
      // en caso de error
      alert(JSON.stringify(error));
    }
  }
  generarPDF() {
    const options = {
      margin: 10,
      filename: 'mascotasRegistradas.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };
    const content = this.reportContent.nativeElement;
    html2pdf().from(content).set(options).save();
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
}
