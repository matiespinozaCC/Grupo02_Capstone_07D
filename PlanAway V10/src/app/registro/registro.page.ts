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
  profileImage: File | null = null;
  step: number = 1;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}


  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.profileImage = file ? file : null;
  }

  nextStep() {
    if (this.step < 7) this.step++;
  }

  prevStep() {
    if (this.step > 1) this.step--;
  }

  ionViewWillEnter() {
    this.resetStep();
  }

  resetStep() {
    this.step = 1;
    this.email = '';
    this.contrasena = '';
    this.nombre = '';
    this.telefono = '';
    this.genero = '';
    this.fechaNacimiento = '';
  }

  async onRegister() {
    try {
      const user = await this.authService.register(
        this.email,
        this.contrasena,
        this.nombre,
        this.telefono,
        this.genero,
        this.fechaNacimiento,
        this.profileImage
      );
      console.log('Usuario registrado:', user);
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Error al registrar:', error);
      this.presentAlert(error.message || 'Hubo un problema al registrarte.');
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
