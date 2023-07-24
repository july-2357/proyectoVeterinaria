import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input-img',
  templateUrl: './input-img.component.html',
  styleUrls: ['./input-img.component.css']
})
export class InputImgComponent implements OnInit {

  constructor() {}

  imagenBase64: string;

  @Input()
  urlImagenActual: any;

  @Output()
  archivoSeleccionado: EventEmitter<File> = new EventEmitter<File>();

  ngOnInit(): void {}

  change(event: any) {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      this.toBase64(file)
        .then((value: any) => (this.imagenBase64 = value))
        .catch((error: any) => console.log(error));
      this.archivoSeleccionado.emit(file);
      this.urlImagenActual = null;
    }
  }
  toBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
}
