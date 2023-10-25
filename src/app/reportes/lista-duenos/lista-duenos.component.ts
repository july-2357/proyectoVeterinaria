import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DuenosService } from 'src/app/services/duenos.service';
import { PdfService } from 'src/app/services/pdf.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-lista-duenos',
  templateUrl: './lista-duenos.component.html',
  styleUrls: ['./lista-duenos.component.css']
})
export class ListaDuenosComponent implements OnInit {
  listaDuenos: any = []; //   Variable global para guardar la inf
  @ViewChild('reportContent') reportContent: ElementRef;
  datosUsuario:any;
  constructor(private duenosService:DuenosService,private pdfService: PdfService, private usuariosSevice:UsuariosService) { }

  ngOnInit(): void {
  this.obtenerDuenos();
  this.mostrarDatosUsuario();
  }
  generarPDF2() {
    const content = this.reportContent.nativeElement;
    this.pdfService.generarPDF(content);
    this.mostrarDatosUsuario();
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
  async obtenerDuenos() {
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
}
