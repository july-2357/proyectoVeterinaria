import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { ConsultasMService } from 'src/app/services/consultas-m.service';
import { MascotasService } from 'src/app/services/mascotas.service';
@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
})
export class GraficosComponent implements OnInit {
  chartdata: any;
  listaMascotas: any = [];
  listaFelino: any = [];
  listaCanino: any = [];
  listaConsultas: any = [];
  listaVacunas: any = [];
  listaDesparacitaciones: any = [];
  listaCirugias: any = [];
  cantidadCanino: number = 0;
  cantidadFelino: number = 0;
  constructor(
    private mascotasService: MascotasService,
    private consultas: ConsultasMService
  ) {}

  ngOnInit() {
    this.obtenerConsultas();
    this.obtenerCirugias();
    this.obtenerDesparacitaciones();
    this.obtenerVacunas();
    this.RenderChart();
  }
  RenderChart() {
    setTimeout(() => {
      var myChart = new Chart('myChart', {
        type: 'bar',
        data: {
          labels: ['Tipos '],
          datasets: [
            {
              label: 'Vacunas',
              data: [this.listaVacunas.length],
              borderWidth: 1,
              backgroundColor: ['rgb(5, 59, 80)'],
            },
            {
              label: 'Consultas',
              data: [this.listaConsultas.length],
              borderWidth: 1,
              backgroundColor: ['rgb(23, 107, 135)'],
            },
            {
              label: 'Desparasitaciones',
              data: [this.listaDesparacitaciones.length],
              borderWidth: 1,
              backgroundColor: ['rgb(100, 204, 197)'],
            },
            {
              label: 'Cirugias',
              data: [this.listaCirugias.length],
              borderWidth: 1,
              backgroundColor: ['rgb(250, 240, 230)'],
            },
          ],
        },
        options: {},
      });
    }, 1500);
  }
  async obtenerConsultas() {
    try {
      let respuesta = await this.consultas.obtenerConsultas(); // mandar el servicio
      if ((respuesta.statusCode = 200)) {
        this.listaConsultas = respuesta.datos;
        console.log(this.listaConsultas);
      }
    } catch (error) {
      console.log('error');
    }
  }
  async obtenerVacunas() {
    try {
      let respuesta = await this.consultas.obtenerVacunas(); // mandar el servicio
      if ((respuesta.statusCode = 200)) {
        this.listaVacunas = respuesta.datos;
      }
    } catch (error) {
      console.log('error');
    }
  }
  async obtenerDesparacitaciones() {
    try {
      let respuesta = await this.consultas.obtenerDesparacitaciones(); // mandar el servicio
      if ((respuesta.statusCode = 200)) {
        this.listaDesparacitaciones = respuesta.datos;
      }
    } catch (error) {
      console.log('error');
    }
  }
  async obtenerCirugias() {
    try {
      let respuesta = await this.consultas.obtenerCirugias(); // mandar el servicio
      if ((respuesta.statusCode = 200)) {
        this.listaCirugias = respuesta.datos;
      }
    } catch (error) {
      console.log('error');
    }
  }
}
