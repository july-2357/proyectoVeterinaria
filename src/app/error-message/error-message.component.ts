import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.css'],
})
export class ErrorMessageComponent {
  @Input() error: any;
  @Input() showError: boolean;

  getErrorMessage(): string {
    if (this.error) {
      if (this.error.required) {
        return 'Este campo es obligatorio.';
      } else if (this.error.email) {
        return 'El formato del correo electrónico no es válido.';
      } else if (this.error.minlength) {
        return `Debe contener al menos ${this.error.minlength.requiredLength} caracteres.`;
      } else if (this.error.maxlength) {
        return `Debe contener como máximo ${this.error.maxlength.requiredLength} caracteres.`;
      } else if (this.error.pattern) {
        if (this.error.pattern.requiredPattern === '^[A-Za-z\\s]*$') {
          return 'Este campo solo acepta letras.';
        } else if (
          this.error.pattern.requiredPattern === '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$'
        ) {
          return 'La contraseña no es válida';
        } else if (
          this.error.pattern.requiredPattern === '^(?!0*[.,]?0*$)\\d+(?:[.,]\\d+)?$'
        ) {
          return 'Debe ser un dato numérico mayor a 0';
        } else if (
          this.error.pattern.requiredPattern === '^(?=.*[1-9])d*$'
        ) {
          return 'Debe ser un numero positivo';
        } else if (
          this.error.pattern.requiredPattern === '^[0-9]{7,8}$'
        ) {
          return 'El formato del celular no es válido';
        }else if (
          this.error.pattern.requiredPattern === '^[1-9][0-9]{6,7}$'
        ) {
          return 'El formato del carnet no es válido';
        }  else if (
          this.error.pattern.requiredPattern === '^[0-9]+([,.][0-9]+)?$'
        ) {
          return 'Debe ser un dato numérico o decimal';
        } else {
          return 'El formato no es válido.';
        }
      }
    }
    return '';
  }

}

//
