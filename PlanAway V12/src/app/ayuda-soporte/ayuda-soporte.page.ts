import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-ayuda-soporte',
  templateUrl: './ayuda-soporte.page.html',
  styleUrls: ['./ayuda-soporte.page.scss'],
})
export class AyudaSoportePage {
  constructor(private router: Router, private toastController: ToastController) {}

  async contactarSoporte() {
    const toast = await this.toastController.create({
      message: 'Se ha enviado un mensaje al equipo de soporte.',
      duration: 3000,
      color: 'success',
      position: 'top',
    });
    toast.present();
  }

  Home() {
    this.router.navigate(['/tabs/home']);
  }
}
