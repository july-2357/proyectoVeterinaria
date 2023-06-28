import { Injectable } from '@angular/core';
import { crearUsuario } from '../modelos/usuarios.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
// https://localhost:7101/api/Cuentas/CrearCuentaUsuario?password=123456as%40A
// {
//   "carnet": "123456",
//   "nombres": "AAA",
//   "apellidoPaterno": "aaaa",
//   "apellidoMaterno": "aaaa",
//   "celular": 123456,
//   "correo": "aasd@sad.com",
//   "direccion": "sasa",
//   "idCuentaIdentity": "a"
// }

async enviarCrearUsuarioService(contrasena:string, cuerpo:crearUsuario){
  let crear=`https://localhost:7101/api/Cuentas/CrearCuentaUsuario?password=${contrasena}`;
  let resultado= await this.http.post<any>(crear,cuerpo).toPromise();
  return resultado;
}
  constructor(private http:HttpClient) {
  }
}
