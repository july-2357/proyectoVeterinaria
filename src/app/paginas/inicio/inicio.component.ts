import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';
import { DuenosService } from 'src/app/services/duenos.service';
import { MascotasService } from 'src/app/services/mascotas.service';
import { DatePipe } from '@angular/common';
import { ConsultasMService } from 'src/app/services/consultas-m.service';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { UsuariosService } from 'src/app/services/usuarios.service';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  listaDuenos: any = [];
  listaMascotas: any = [];
  listaUsuarios: any = [];
  nUsuarios: string;
  ultimasMascotas: any = [];
  nDuenos: string;
  nMascotas: string;
  nConsultas: any = 0;
  fechaActual: Date | null = new Date();
  fecha: string | null;
  //variables para guardar las listas
  listaConsultas: any = [];
  listaVacunas: any = [];
  listaDesparacitaciones: any = [];
  listaCirugias: any = [];
  //variables para guardar las listas
  listaConsultasGeneral: any = [];
  listaVacunasGeneral: any = [];
  listaDesparacitacionesGeneral: any = [];
  listaCirugiasGeneral: any = [];
  //Variables para las ventas
  ventasVacunas: number = 0;
  ventasConsultas: number = 0;
  ventasDesparacitaciones: number = 0;
  ventasCirugias: number = 0;
  precioDesparacitaciones: any;
  tiempo: string;
  fechaHoy: Date;
  contenidoSeleccionado: string = 'dia';
  constructor(
    private duenosService: DuenosService,
    private mascotasService: MascotasService,
    private datePipe: DatePipe,
    private consultas: ConsultasMService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private usuariosService: UsuariosService
  ) {
    this.fecha = this.datePipe.transform(this.fechaActual, 'yyyy-MM-dd');
  }

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    this.mostrarDuenos();
    this.mostrarMascotas();
    this.obtenerUsuarios();
    this.ventasPorDia();
    this.tiempo = 'DIA';
    this.listaConsultasGeneral = await this.obtenerConsultas();
    this.listaCirugiasGeneral = await this.obtenerCirugias();
    this.listaDesparacitacionesGeneral = await this.obtenerDesparacitaciones();
    this.listaVacunasGeneral = await this.obtenerVacunas();
    this.nConsultas =
      this.listaConsultas.length +
      this.listaCirugias.length +
      this.listaDesparacitaciones.length +
      this.listaVacunas.length;
    this.RenderChart();
    this.spinner.hide();
  }
  RenderChart() {
    var myChart = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: ['Tipos '],
        datasets: [
          {
            label: 'Vacunas',
            data: [this.listaVacunasGeneral.length],
            borderWidth: 1,
            backgroundColor: ['rgb(5, 59, 80)'],
          },
          {
            label: 'Consultas',
            data: [this.listaConsultasGeneral.length],
            borderWidth: 1,
            backgroundColor: ['rgb(23, 107, 135)'],
          },
          {
            label: 'Desparasitaciones',
            data: [this.listaDesparacitacionesGeneral.length],
            borderWidth: 1,
            backgroundColor: ['rgb(100, 204, 197)'],
          },
          {
            label: 'Cirugias',
            data: [this.listaCirugiasGeneral.length],
            borderWidth: 1,
            backgroundColor: ['rgb(250, 240, 230)'],
          },
        ],
      },
      options: {},
    });
  }
  async mostrarDuenos() {
    try {
      // el back esta como quieres
      let respuesta = await this.duenosService.listarDuenosService(); // mandar el servicio

      if ((respuesta.statusCode = 200)) {
        this.listaDuenos = respuesta.datos;
        this.nDuenos = this.listaDuenos.length;
      }
    } catch (error) {
      // en caso de error
      alert(JSON.stringify(error));
    }
  }
  async mostrarMascotas() {
    try {
      // el back esta como quieres
      let respuesta = await this.mascotasService.listarMascotasServices(); // mandar el servicio

      if ((respuesta.statusCode = 200)) {
        this.listaMascotas = respuesta.datos;

        this.nMascotas = this.listaMascotas.length;
        for (let i = 0; i < this.listaMascotas.length; i++) {
          const mascota = this.listaMascotas[i];
          const fecha = this.datePipe.transform(
            mascota.mascota.fecha_cre,
            'yyyy-MM-dd'
          );
          if (fecha === this.fecha) {
            this.ultimasMascotas.push(mascota.mascota);
          }
        }
      }
    } catch (error) {}
  }
  async obtenerConsultas() {
    this.spinner.show();
    try {
      let respuesta = await this.consultas.obtenerConsultas(); // mandar el servicio
      this.spinner.hide();

      if ((respuesta.statusCode = 200)) {
        return respuesta.datos;
      }
    } catch (error) {
      return error;
    }
  }
  async obtenerVacunas() {
    try {
      let respuesta = await this.consultas.obtenerVacunas(); // mandar el servicio
      if ((respuesta.statusCode = 200)) {
        return respuesta.datos;
      }
    } catch (error) {
      return error;
    }
  }
  async obtenerDesparacitaciones() {
    try {
      let respuesta = await this.consultas.obtenerDesparacitaciones(); // mandar el servicio
      if ((respuesta.statusCode = 200)) {
        return respuesta.datos;
      }
    } catch (error) {
      return error;
    }
  }
  async obtenerCirugias() {
    try {
      let respuesta = await this.consultas.obtenerCirugias();
      if ((respuesta.statusCode = 200)) {
        return respuesta.datos;
      }
    } catch (error) {
      return error;
    }
  }
  async obtenerUsuarios() {
    try {
      let respuesta = await this.usuariosService.listarUsuariosService(
        'usuarios'
      );

      if (respuesta.statusCode === 200) {
        this.listaUsuarios = respuesta.datos;
        this.nUsuarios = this.listaUsuarios.length;
      }
    } catch (error) {
      alert(JSON.stringify(error));
    }
  }
  cambiarContenido(contenido: string) {
    if (contenido === 'dia') {
      this.contenidoSeleccionado = 'dia';
      this.ventasPorDia();
      this.tiempo = 'DIA';
    } else if (contenido === 'mes') {
      this.contenidoSeleccionado = 'mes';
      this.tiempo = 'MES';
      this.ventasPorMes();
    } else if (contenido === 'anio') {
      this.contenidoSeleccionado = 'anio';
      this.tiempo = 'AÑO';
      this.ventasPorAnio();
    }
  }

  async ventasPorAnio() {
    try {
      this.fechaHoy = new Date();
      const aaaa = String(this.fechaHoy.getFullYear());
      this.listaConsultas = await this.obtenerConsultas();
      this.listaCirugias = await this.obtenerCirugias();
      this.listaDesparacitaciones = await this.obtenerDesparacitaciones();
      this.listaVacunas = await this.obtenerVacunas();
      this.ventasCirugias = 0;
      this.ventasConsultas = 0;
      this.ventasDesparacitaciones = 0;
      this.ventasVacunas = 0;
      for (let i = 0; i < this.listaConsultas.length; i++) {
        const consulta = this.listaConsultas[i];
        const fechaa = consulta.fecha_registro_consulta;
        const partes = fechaa.split('-');
        let anio = '';
        if (partes.length === 3) {
          anio = partes[0];
        }
        if (aaaa === anio) {
          const precio = parseInt(consulta.precio, 10);
          if (precio) {
            this.ventasConsultas = precio + this.ventasConsultas;
          }
        }
      }
      for (let i = 0; i < this.listaCirugias.length; i++) {
        const cirugia = this.listaCirugias[i];
        const fechaa = cirugia.fecha_cirugia;
        const partes = fechaa.split('-');
        let anio = '';
        if (partes.length === 3) {
          anio = partes[0];
        }
        if (aaaa === anio) {
          const precio = parseInt(cirugia.precio, 10);
          if (precio) {
            this.ventasCirugias = precio + this.ventasCirugias;
          }
        }
      }
      for (let i = 0; i < this.listaDesparacitaciones.length; i++) {
        const desparacitacion = this.listaDesparacitaciones[i];
        const fechaa = desparacitacion.fecha_desparacitacion;
        const partes = fechaa.split('-');
        let anio = '';
        if (partes.length === 3) {
          anio = partes[0];
        }
        if (aaaa === anio) {
          const precio = parseInt(desparacitacion.precio, 10);
          if (precio) {
            this.ventasDesparacitaciones =
              precio + this.ventasDesparacitaciones;
          }
        }
      }
      for (let i = 0; i < this.listaVacunas.length; i++) {
        const vacuna = this.listaVacunas[i];
        const fechaa = vacuna.fecha_vacunacion;
        const partes = fechaa.split('-');
        let anio = '';
        if (partes.length === 3) {
          anio = partes[0];
        }
        if (aaaa === anio) {
          const precio = parseInt(vacuna.precio, 10);
          if (precio) {
            this.ventasVacunas = precio + this.ventasVacunas;
          }
        }
      }
    } catch (error) {
      console.error('Error en ventasTiempo:', error);
    }
  }
  async ventasPorMes() {
    try {
      this.fechaHoy = new Date();
      const mm = String(this.fechaHoy.getMonth() + 1).padStart(2, '0');
      const aaaa = String(this.fechaHoy.getFullYear());
      this.listaConsultas = await this.obtenerConsultas();
      this.listaCirugias = await this.obtenerCirugias();
      this.listaDesparacitaciones = await this.obtenerDesparacitaciones();
      this.listaVacunas = await this.obtenerVacunas();
      this.ventasCirugias = 0;
      this.ventasConsultas = 0;
      this.ventasDesparacitaciones = 0;
      this.ventasVacunas = 0;
      for (let i = 0; i < this.listaConsultas.length; i++) {
        const consulta = this.listaConsultas[i];
        const fechaa = consulta.fecha_registro_consulta;
        const partes = fechaa.split('-');
        let mes = '';
        let anio = '';
        if (partes.length === 3) {
          mes = partes[1];
          anio = partes[0];
        }
        if (mm === mes && anio == aaaa) {
          const precio = parseInt(consulta.precio, 10);
          this.ventasConsultas = precio + this.ventasConsultas;
        }
      }
      for (let i = 0; i < this.listaCirugias.length; i++) {
        const cirugia = this.listaCirugias[i];
        const fechaa = cirugia.fecha_cirugia;
        const partes = fechaa.split('-');
        let mes = '';
        let anio = '';
        if (partes.length === 3) {
          mes = partes[1];
          anio = partes[0];
        }
        if (mm === mes && anio == aaaa) {
          const precio = parseInt(cirugia.precio, 10);
          if (precio) {
            this.ventasCirugias = precio + this.ventasCirugias;
          }
        }
      }
      for (let i = 0; i < this.listaDesparacitaciones.length; i++) {
        const desparacitacion = this.listaDesparacitaciones[i];
        const fechaa = desparacitacion.fecha_desparacitacion;
        const partes = fechaa.split('-');
        let mes = '';
        let anio = '';
        if (partes.length === 3) {
          mes = partes[1];
          anio = partes[0];
        }
        if (mm === mes && anio === aaaa) {
          const precio = parseInt(desparacitacion.precio, 10);
          if (precio) {
            this.ventasDesparacitaciones =
              precio + this.ventasDesparacitaciones;
          }
        }
      }
      for (let i = 0; i < this.listaVacunas.length; i++) {
        const vacuna = this.listaVacunas[i];
        const fechaa = vacuna.fecha_vacunacion;
        const partes = fechaa.split('-');
        let mes = '';
        let anio = '';
        if (partes.length === 3) {
          mes = partes[1];
          anio = partes[0];
        }
        if (mm === mes && anio === aaaa) {
          const precio = parseInt(vacuna.precio, 10);
          if (precio) {
            this.ventasVacunas = precio + this.ventasVacunas;
          }
        }
      }
      console.log(this.ventasCirugias);
      console.log(this.ventasConsultas);
      console.log(this.ventasDesparacitaciones);
      console.log(this.ventasVacunas);
    } catch (error) {
      console.error('Error en ventasTiempo:', error);
    }
  }
  async ventasPorDia() {
    try {
      this.fechaHoy = new Date();
      const dd = String(this.fechaHoy.getDate()).padStart(2, '0');
      const aaaa = String(this.fechaHoy.getFullYear());
      const mm = String(this.fechaHoy.getMonth() + 1).padStart(2, '0');
      this.listaConsultas = await this.obtenerConsultas();
      this.listaCirugias = await this.obtenerCirugias();
      this.listaDesparacitaciones = await this.obtenerDesparacitaciones();
      this.listaVacunas = await this.obtenerVacunas();
      this.ventasCirugias = 0;
      this.ventasConsultas = 0;
      this.ventasDesparacitaciones = 0;
      this.ventasVacunas = 0;
      for (let i = 0; i < this.listaConsultas.length; i++) {
        const consulta = this.listaConsultas[i];
        const fechaa = consulta.fecha_registro_consulta;
        const partes = fechaa.split('-');
        let dia = '';
        let mes = '';
        let anio = '';
        if (partes.length === 3) {
          dia = partes[2];
          mes = partes[1];
          anio = partes[0];
        }
        if (dd === dia && mm === mes && aaaa === anio) {
          const precio = parseInt(consulta.precio, 10);
          if (precio) {
            this.ventasConsultas = precio + this.ventasConsultas;
          }
        }
      }
      for (let i = 0; i < this.listaCirugias.length; i++) {
        const cirugia = this.listaCirugias[i];
        const fechaa = cirugia.fecha_cirugia;
        const partes = fechaa.split('-');
        let dia = '';
        let mes = '';
        let anio = '';
        if (partes.length === 3) {
          dia = partes[2];
          mes = partes[1];
          anio = partes[0];
        }
        if (dd === dia && mm === mes && aaaa === anio) {
          const precio = parseInt(cirugia.precio, 10);
          if (precio) {
            this.ventasCirugias = precio + this.ventasCirugias;
          }
        }
      }
      for (let i = 0; i < this.listaDesparacitaciones.length; i++) {
        const desparacitacion = this.listaDesparacitaciones[i];
        const fechaa = desparacitacion.fecha_desparacitacion;
        const partes = fechaa.split('-');
        let dia = '';
        let mes = '';
        let anio = '';
        if (partes.length === 3) {
          dia = partes[2];
          mes = partes[1];
          anio = partes[0];
        }
        if (dd === dia && mm === mes && aaaa === anio) {
          const precio = parseInt(desparacitacion.precio, 10);
          if (precio) {
            this.ventasDesparacitaciones =
              precio + this.ventasDesparacitaciones;
          }
        }
      }
      for (let i = 0; i < this.listaVacunas.length; i++) {
        const vacuna = this.listaVacunas[i];
        const fechaa = vacuna.fecha_vacunacion;
        const partes = fechaa.split('-');
        let dia = '';
        let mes = '';
        let anio = '';
        if (partes.length === 3) {
          dia = partes[2];
          mes = partes[1];
          anio = partes[0];
        }
        if (dd === dia && mm === mes && aaaa === anio) {
          const precio = parseInt(vacuna.precio, 10);
          if (precio) {
            this.ventasVacunas = precio + this.ventasVacunas;
          }
        }
      }
    } catch (error) {
      console.error('Error en ventasTiempo:', error);
    }
  }
  navegarVentanaHistorial(mascota: any) {
    localStorage.setItem('idMascotaHistorial', mascota.idMascota);
    localStorage.setItem('idDuenoHistorial', mascota.dueno.idDuenos);
    this.router.navigate(['/principal/historial']);
  }
}
