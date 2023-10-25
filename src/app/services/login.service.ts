import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { crearLogin } from '../modelos/login.model.ts.module';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  async enviarLoginService(cuerpo: FormData) {
    try {
      let crear = `https://localhost:7101/api/Cuentas/login`;
      let resultado = await this.http.post<any>(crear, cuerpo).toPromise();
      return resultado;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  constructor(private http: HttpClient) {}
}
