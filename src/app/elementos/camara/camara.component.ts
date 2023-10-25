import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-camara',
  templateUrl: './camara.component.html',
  styleUrls: ['./camara.component.css'],
})
export class CamaraComponent implements OnInit {
  @ViewChild('videoElement') videoElement: ElementRef;
  @Output() imagenCapturada = new EventEmitter<string>();

  photo: any;
  private stream: MediaStream | null = null;
  camaraAbierta: boolean = false;
  fotoTomada: boolean = false;
  imagenBase64: string;
  ngOnInit(): void {
    this.startCamera();
  }

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoElement.nativeElement.srcObject = this.stream;
      this.fotoTomada = false;
      this.camaraAbierta = true;
      console.log('En abrir camara camara abierta');
      console.log(this.camaraAbierta);
    } catch (error) {
      console.error('Error al acceder a la cámara: ', error);
    }
  }
  async takePhoto() {
    const canvas = document.createElement('canvas');
    canvas.width = this.videoElement.nativeElement.videoWidth;
    canvas.height = this.videoElement.nativeElement.videoHeight;
    const context = canvas.getContext('2d');

    if (context) {
      context.drawImage(this.videoElement.nativeElement, 0, 0);
      this.photo = canvas.toDataURL('image/jpeg');
      this.imagenCapturada.emit(this.photo); // Emitir directamente la URL de datos en formato base64
      this.fotoTomada = true;
      this.camaraAbierta = false;
      this.detenerCamara();
    } else {
      console.error('Contexto 2D no encontrado en el elemento canvas.');
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

  eliminarFoto(): void {
    this.fotoTomada = false;
    this.photo = null;
    this.camaraAbierta = false; // Cierra la cámara al eliminar la foto
    this.detenerCamara(); // Detiene la cámara al eliminar la foto
  }
  detenerCamara() {
    if (this.stream) {
      const tracks = this.stream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
      this.stream = null;
    }
  }
  ngOnDestroy() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
  }
}
