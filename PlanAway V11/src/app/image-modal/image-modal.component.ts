import { Component, Input } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { AuthService } from '../servicios/auth.service'; // Importa AuthService para la actualización de la imagen

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss'],
})
export class ImageModalComponent {
  @Input() imageSrc!: string; // Recibe la URL de la imagen actual

  constructor(
    private modalController: ModalController,
    private authService: AuthService // Servicio para actualizar la imagen en Firebase
  ) {}

  closeModal() {
    this.modalController.dismiss();
  }

  async changeProfileImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      try {
        // Llama al método de AuthService para subir la nueva imagen y obtener la URL
        const newImageUrl = await this.authService.uploadProfileImage(file);
        this.imageSrc = newImageUrl; // Actualiza la imagen en el modal en tiempo real
        this.modalController.dismiss(newImageUrl); // Cierra el modal y envía la nueva URL al perfil
      } catch (error) {
        console.error('Error al subir la nueva imagen:', error);
      }
    }
  }
}
