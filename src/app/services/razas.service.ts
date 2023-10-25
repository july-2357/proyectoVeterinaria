import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RazasService {
  constructor(private http: HttpClient) {}
  async listarRazasService(descripcionEspecie: string) {
    try {
      const listar = `https://localhost:7101/api/clasificadores/obtenerRazas?descripcionEspecie=${descripcionEspecie}`;
      let resultado = await this.http.get<any>(listar).toPromise();
      return resultado;
    } catch (error) {
      throw error;
    }
  }
}
