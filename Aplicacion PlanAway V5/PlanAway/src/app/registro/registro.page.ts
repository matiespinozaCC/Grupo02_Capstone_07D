import { Component } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  email: string = '';
  contrasena: string = '';
  nombre: string = '';
  telefono: string = '';
  genero: string = '';
  fechaNacimiento: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async onRegister() {
    try {
      const user = await this.authService.register(this.email, this.contrasena, this.nombre, this.telefono, this.genero, this.fechaNacimiento);
      console.log('Usuario registrado:', user);
      this.email = '';
      this.contrasena = '';
      this.nombre = '';
      this.telefono = '';
      this.genero = '';
      this.fechaNacimiento = '';
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Error al registrar:', error);
      const errorMsg = error.message || 'Hubo un problema al registrarte.';
      this.presentAlert(errorMsg);
    }
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Vaya, algo ha salido mal',
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
