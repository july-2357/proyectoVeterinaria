import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnamnesisService {
  async enviarCrearAnamnesisService(cuerpo:FormData){
    let crear=`https://localhost:7101/api/ConsultaMedica/RegistrarAnamnecis`;
    let resultado= await this.http.post<any>(crear,cuerpo).toPromise();
    return resultado;
  }
  constructor(private http:HttpClient) { }
}
