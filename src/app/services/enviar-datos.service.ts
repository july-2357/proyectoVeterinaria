import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EnviarDatosService {
  private parametro: any;
  private anamnesis:any;

  constructor() {}

  setDatos(param: any) {
    this.parametro = param;
  }

  getDatos(): any {
    return this.parametro;
  }
  limpiarDatos() {
    this.parametro = null;
  }
  setDatosAnamnesis(param: any) {
    this.anamnesis = param;
  }
  getDatosAnamnesis() {
   return this.anamnesis ;
  }
}
