import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InicioSesionService {
  private isAuthenticated = false;

  // Método para iniciar sesión
  login() {
    // Realizar la lógica de inicio de sesión aquí
    this.isAuthenticated = true;
  }

  // Método para cerrar sesión
  logout() {
    // Realizar la lógica de cierre de sesión aquí, como limpiar tokens o datos de usuario
    this.isAuthenticated = false;
  }

  // Verificar si el usuario está autenticado
  isAuthenticatedUser() {
    return this.isAuthenticated;
  }

}
