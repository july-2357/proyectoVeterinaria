import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConsultasMService {
  async enviarCrearAnamnesisService(cuerpo: FormData) {
    let crear = `https://localhost:7101/api/ConsultaMedica/RegistrarAnamnecis`;
    let resultado = await this.http.post<any>(crear, cuerpo).toPromise();
    return resultado;
  }
  async enviarCrearControlFisico(cuerpo: FormData) {
    let crear = `https://localhost:7101/api/ConsultaMedica/RegistrarControlFisico`;
    let resultado = await this.http.post<any>(crear, cuerpo).toPromise();
    return resultado;
  }

  async enviarCrearConsulta(cuerpo: FormData) {
    let crear = `https://localhost:7101/api/ConsultaMedica/RegistrarConsultaMedica`;
    let resultado = await this.http.post<any>(crear, cuerpo).toPromise();
    return resultado;
  }
  async enviarCrearVacuna(cuerpo: FormData) {
    let crear = `https://localhost:7101/api/Vacuna/RegistrarVacuna`;
    let resultado = await this.http.post<any>(crear, cuerpo).toPromise();
    return resultado;
  }
  async enviarCrearDesparacitacion(cuerpo: FormData) {
    let crear = `https://localhost:7101/api/Desparacitacion/RegistrarDesparacitacion`;
    let resultado = await this.http.post<any>(crear, cuerpo).toPromise();
    return resultado;
  }
  async enviarCrearCirugia(cuerpo: FormData) {
    let crear = `https://localhost:7101/api/Cirugia/RegistrarCirugia`;
    let resultado = await this.http.post<any>(crear, cuerpo).toPromise();
    return resultado;
  }
  async obtenerHistorialMascota(idMascota: number) {
    const url = `https://localhost:7101/api/ConsultaMedica/obtenerHistorialMascota?idMascota=${idMascota}`;


    try {
      const resultado = await this.http.get<any>(url).toPromise();
      return resultado;
    } catch (error) {
      console.error('Error al obtener el historial de mascota:', error);
      throw error;
    }
  }
  async obtenerConsultas() {
    const url = `https://localhost:7101/api/ConsultaMedica/obtenerConsultas`;
    try {
      const resultado = await this.http.get<any>(url).toPromise();
      return resultado;
    } catch (error) {
      console.error('Error al obtener consultas', error);
      throw error;
    }
  }
  async obtenerVacunas() {
    const url = `https://localhost:7101/api/ConsultaMedica/obtenerVacunas`;
    try {
      const resultado = await this.http.get<any>(url).toPromise();
      return resultado;
    } catch (error) {
      console.error('Error al obtener consultas', error);
      throw error;
    }
  }
  async obtenerDesparacitaciones() {
    const url = `https://localhost:7101/api/ConsultaMedica/obtenerDesparasitaciones`;
    try {
      const resultado = await this.http.get<any>(url).toPromise();
      return resultado;
    } catch (error) {
      console.error('Error al obtener consultas', error);
      throw error;
    }
  }
  async obtenerCirugias() {
    const url = `https://localhost:7101/api/ConsultaMedica/obtenerCirugias`;
    try {
      const resultado = await this.http.get<any>(url).toPromise();
      return resultado;
    } catch (error) {
      console.error('Error al obtener consultas', error);
      throw error;
    }
  }
  constructor(private http: HttpClient) {}
}
