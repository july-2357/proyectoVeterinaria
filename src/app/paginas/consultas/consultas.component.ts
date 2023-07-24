import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css'],
})
export class ConsultasComponent implements OnInit {
  formRegistrarConsulta: FormGroup;
  constructor( private formBuilder: FormBuilder) {}

  construirFormulario() {
    this.formRegistrarConsulta = this.formBuilder.group({
      /*Anamnesis */

      apetito: [, [Validators.required]],
      agua: ['', [Validators.required]],
      conducta: ['', [Validators.required]],
      defecacion: ['', [Validators.required]],
      alteracionesRes: ['', [Validators.required]],
      alteracionesNeuro: ['', [Validators.required]],
      problemasUr: ['', [Validators.required]],
      /*Control medico */
      temperatura:['', [Validators.required]],
      frecCardiaca: ['', [Validators.required]],
      frecRespiratoria: ['', [Validators.required]],
      peso: ['', [Validators.required]],
      /*Consulta medica */
      motivoConsulta:['', [Validators.required]],
      diagnosticoConsulta: ['', [Validators.required]],
      tratamiento: ['', [Validators.required]],
      proxVisita: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.construirFormulario();
  }
  async guardarAnamnesis() {
    if (this.formRegistrarConsulta.valid) {
      console.log(this.formRegistrarConsulta.value);

          let anamnesisEnviar:any={
          apetito:this.formRegistrarConsulta.get("apetito")?.value,
          agua:this.formRegistrarConsulta.get("agua")?.value,
          conducta: this.formRegistrarConsulta.get("conducta")?.value,
          defecacion: this.formRegistrarConsulta.get("defecacion")?.value,
          alteracionesRes:this.formRegistrarConsulta.get("alteracionesRes")?.value,
          alteracionesNeuro: this.formRegistrarConsulta.get("alteracionesNeuro")?.value,
          problemasUr: this.formRegistrarConsulta.get("problemasUr")?.value
        }
    } else {
      //console.log(this.formRegistrarConsulta.value);
    }
  }
}
