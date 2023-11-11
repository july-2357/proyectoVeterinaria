import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-primera-consulta',
  templateUrl: './primera-consulta.component.html',
  styleUrls: ['./primera-consulta.component.css'],
})
export class PrimeraConsultaComponent implements OnInit {
  formPrimeraConsulta: FormGroup;
  opcionesSeleccionadas: string[] = [];
  @Input() idMascota: number;

  constructor(private formBuilder: FormBuilder) {}
  construirFormularioPrimeraConsulta() {
    this.formPrimeraConsulta = this.formBuilder.group({
      condicionCorporal: ['', [Validators.required]],
      habitad: ['', [Validators.required]],
      estadoReproductivo: ['', [Validators.required]],
      convivenciaConAnimales: ['', [Validators.required]],
      detalleConvivencia: ['', [Validators.required]],
      vacunacion: ['', [Validators.required]],
      detalleVacunas: ['', [Validators.required]],
      fechaUltimaVacunacion: ['', [Validators.required]],
      desparacitacion: ['', [Validators.required]],
      detalleDesparacitacion: ['', [Validators.required]],
      fechaUltimadesparacitacion: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.construirFormularioPrimeraConsulta();
    console.log('idMascota');
    console.log(this.idMascota);
  }

  guardarPrimeraConsulta() {
    if (this.formPrimeraConsulta.valid) {
      let primeraConsulta: any = {
        condicionCorporal:
          this.formPrimeraConsulta.get('condicionCorporal')?.value,
        habitad: this.formPrimeraConsulta.get('habitad')?.value,
        estadoReproductivo:
          this.formPrimeraConsulta.get('estadoReproductivo')?.value,
        detalleConvivencia:
          this.formPrimeraConsulta.get('detalleConvivencia')?.value,
        detalleVacunas: this.formPrimeraConsulta.get('detalleVacunas')?.value,
        fechaUltimaVacunacion: this.formPrimeraConsulta.get(
          'fechaUltimaVacunacion'
        )?.value,
        detalleDesparacitacion: this.formPrimeraConsulta.get(
          'detalleDesparacitacion'
        )?.value,
        fechaUltimadesparacitacion: this.formPrimeraConsulta.get(
          'fechaUltimadesparacitacion'
        )?.value,
        idMascota: '',
      };
      console.log(primeraConsulta);
    }
  }
  getSelectedOptionsText(): string {
    const selectedOptions =
      this.formPrimeraConsulta.get('detalleVacunas')?.value;
    const optionTexts = selectedOptions.map((option: string) => {
      // Aquí puedes realizar cualquier transformación necesaria en cada opción
      return option;
    });
    return optionTexts.join(', ');
  }
}
