import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MascotasService {

  constructor(private http:HttpClient) { }
  async enviarCrearMascota(cuerpo:FormData){
    let crear=`https://localhost:7101/api/Mascota/RegistrarMascota`;
    let resultado= await this.http.post<any>(crear,cuerpo).toPromise();
    return resultado;
  }
  async listarMascotasServices(){
    let listar=`https://localhost:7101/api/Mascota/obtenerMascotas`;
    let resultado= await this.http.get<any>(listar).toPromise();
    return resultado;
  }
}
