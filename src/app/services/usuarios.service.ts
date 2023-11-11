import { Injectable } from '@angular/core';
import { crearUsuario } from '../modelos/usuarios.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  async enviarCrearUsuarioService(
    contrasena: string,
    rol: string,
    cuerpo: FormData
  ) {
    let crear = `https://localhost:7101/api/Cuentas/CrearCuentaUsuario?password=${contrasena}&rol=${rol}`;
    let resultado = await this.http.post<any>(crear, cuerpo).toPromise();
    return resultado;
  }

  async listarUsuariosService(usuario: string) {
    let listar = `https://localhost:7101/api/Personas/obtenerPersonas?idUsuario=${usuario}`;
    let resultado = await this.http.get<any>(listar).toPromise();
    return resultado;
  }
  async asignarRol(usuarioId: string, rol: string) {
    const url = `https://localhost:7101/api/Cuentas/asignarRol?usuarioId=${usuarioId}&rol=${rol}`;
    console.log(url + '------');
    const resultado = await this.http.post<any>(url, {}).toPromise();
    return resultado;
  }

  async ActualizarDatosUsuarioService(
    idCuentaIdentity: string,
    credenciales: boolean,
    password: string,
    cuerpo: FormData
  ) {
    const url = `https://localhost:7101/api/Personas/ActualizarPersona/${idCuentaIdentity}?actualizaCredenciales=${credenciales}&password=${password}`;
    try {
      const resultado = await this.http.put<any>(url, cuerpo).toPromise();
      return resultado;
    } catch (error) {
      console.error('Error al actualizar', error);
      throw error;
    }
  }

  constructor(private http: HttpClient) {}
}
