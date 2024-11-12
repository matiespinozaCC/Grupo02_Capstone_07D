import { Component } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  contrasena: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  // metodo para simular una carga
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'verificando...',
      duration: 2000,
      spinner: 'circles',
    });
    await loading.present();
  }

  // Método para mostrar alerta de error
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  onLogin() {
    this.authService.login(this.email, this.contrasena)
      .then(user => {
        console.log('Usuario:', user);
        this.email = '';
        this.contrasena = '';
        this.presentLoading(); // aqui es para que se muestre la carga antes de authentificar
        this.router.navigate(['tabs/home']);
      })
      .catch(error => {
        console.error('Error al iniciar sesión:', error);
        this.contrasena = '';

        
        this.showAlert('Vaya, algo ha salido mal', 'Correo o contraseña incorrectas');
      });
  }
}
