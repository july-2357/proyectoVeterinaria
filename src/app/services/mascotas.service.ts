import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MascotasService {
  constructor(private http: HttpClient) {}
  async enviarCrearMascota(cuerpo: FormData) {
    try {
      let crear = `https://localhost:7101/api/Mascota/RegistrarMascota`;
      let resultado = await this.http.post<any>(crear, cuerpo).toPromise();
      return resultado;
    } catch (error) {
      throw error;
    }
  }
  async listarMascotasServices() {
    let listar = `https://localhost:7101/api/Mascota/obtenerMascotas`;

    try {
      let resultado = await this.http.get<any>(listar).toPromise();
      return resultado;
    } catch (error) {
      console.error('Error al obtener la lista de las mascotas:', error);
      throw error;
    }
  }
  async actualizarMascotasServices(idMascota: Number, cuerpo: FormData) {
    try {
      let actualizar = `https://localhost:7101/api/Mascota/ActualizarMascota/${idMascota}`;
      let resultado = await this.http.put<any>(actualizar, cuerpo).toPromise();
      return resultado;
    } catch (error) {
      throw error;
    }
  }
  async eliminarMascotaServices(idMascota: number) {
    const url = `https://localhost:7101/api/Mascota/EliminarMascota/${idMascota}`;
    try {
      const resultado = await this.http.delete<any>(url).toPromise();
      return resultado;
    } catch (error) {
      console.error('Error al eliminar', error);
      throw error;
    }
  }
  // async eliminarMascotaServices(idMascota: Number) {
  //   try {
  //     let listar=`https://localhost:7101/api/Mascota/EliminarMascota?mascotaId=${idMascota}`;
  //     let resultado= await this.http.get<any>(listar).toPromise();
  //     return resultado;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
