import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EspeciesService {

  constructor(private http:HttpClient) {

  }
  async listarEspeciesService(){
    let listar=`https://localhost:7101/api/clasificadores/obtenerEspecies`;
    let resultado= await this.http.get<any>(listar).toPromise();
    return resultado;
  }
  async listarRazasService(descripcionEspecie: string){
    const listar = `https://localhost:7101/api/clasificadores/obtenerRazas?descripcionEspecie=${descripcionEspecie}`;
    let resultado= await this.http.get<any>(listar).toPromise();
    console.log(listar);
    return resultado;
  }
}
