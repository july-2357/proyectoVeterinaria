import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DuenosService {
  async enviarCrearDuenoService(cuerpo: FormData) {
    try {
      let crear = `https://localhost:7101/api/Duenos/RegistrarDuenos`;
      let resultado = await this.http.post<any>(crear, cuerpo).toPromise();
      return resultado;
    } catch (error) {
      throw  error;
    }
  }
  async listarDuenosService() {
    try {
      let listar = `https://localhost:7101/api/Duenos/obtenerDuenos`;
      let resultado = await this.http.get<any>(listar).toPromise();
      return resultado;
    } catch (error) {
      throw  error;
    }
  }
  async listarMascotasdeDuenosService(idDueno: Number) {
    try {
      let listar = `https://localhost:7101/api/Duenos/obtenerDuenosMascota?idDueno=${idDueno}`;
      let resultado = await this.http.get<any>(listar).toPromise();
      return resultado;
    } catch (error) {
      throw  error;
    }
  }
  async actualizarDuenosService(idDueno: Number, cuerpo: FormData) {
    try {
      let actualizar = `https://localhost:7101/api/Duenos/ActualizarDueno/${idDueno}`;
      let resultado = await this.http.put<any>(actualizar, cuerpo).toPromise();
      return resultado;
    } catch (error) {
      throw  error;
    }
  }
  async enviarCorreo(cuerpo: FormData) {
    try {
      let enviar = `https://localhost:7101/api/Email/envioCorreo`;
      let resultado = await this.http.post<any>(enviar, cuerpo).toPromise();
      return resultado;
    } catch (error) {
      throw  error;
    }
  }
  async eliminarDuenoServices(duenoId: number) {
    const url = `https://localhost:7101/api/Duenos/EliminarDueno/${duenoId}`;
    try {
      const resultado = await this.http.delete<any>(url).toPromise();
      return resultado;
    } catch (error) {
      console.error('Error al eliminar', error);
      throw error;
    }
  }
  constructor(private http: HttpClient) {}
}
