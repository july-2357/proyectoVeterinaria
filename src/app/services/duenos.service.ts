import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DuenosService {

  async enviarCrearDuenoService(cuerpo:FormData){
    let crear=`https://localhost:7101/api/Duenos/RegistrarDuenos`;
    let resultado= await this.http.post<any>(crear,cuerpo).toPromise();
    return resultado;
  }

  async listarDuenosService(){
    let listar=`https://localhost:7101/api/Duenos/obtenerDuenos`;
    let resultado= await this.http.get<any>(listar).toPromise();
    return resultado;
  }


  constructor(private http:HttpClient) { }
}
