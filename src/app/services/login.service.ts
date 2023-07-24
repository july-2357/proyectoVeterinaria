import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { crearLogin } from '../modelos/login.model.ts.module';
@Injectable({
  providedIn: 'root',
})
export class LoginService {

  async enviarLoginService(correo: string, contrasena: string) {
    const loginData:crearLogin = { email:correo, password:contrasena };

    let crear = `https://localhost:7101/api/Cuentas/login`;
    let resultado= await this.http.post<any>(crear,loginData).toPromise();
    return resultado;
  }

  constructor(private http:HttpClient) {


  }
}
