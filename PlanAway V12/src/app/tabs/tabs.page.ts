import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../servicios/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage {
  showMenu: boolean = false;
  isAdmin: boolean = false;

  constructor(private router: Router, private alertController: AlertController, private authService: AuthService) {}

  async checkAdminStatus() {
    try {
      const userProfile = await this.authService.getUserProfile();
      this.isAdmin = userProfile?.administrador === true;
      console.log('Usuario es administrador:', this.isAdmin);
    } catch (error) {
      console.error('Error al verificar el rol del usuario:', error);
    }
  }

  ngOnInit() {
    this.checkAdminStatus();
  }

  
  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  
  editarPerfil() {
    this.showMenu = false;
    this.router.navigate(['/editar-perfil']);
  }

  configurarUbicacion() {
    this.showMenu = false;
    console.log('Configuración de ubicación');
  }

  ayudaSoporte() {
    this.showMenu = false;
    this.router.navigate(['/ayuda-soporte']);
  }

  verAcercaDe() {
    this.showMenu = false;
    console.log('Acerca de la aplicación');
  }

  async cerrarSesion() {
    this.showMenu = false;
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          role: 'destructive',
          handler: () => {
            this.authService.logout().then(() => {
            this.router.navigate(['/login']);
            location.reload();
            });
          },
        },
      ],
    });

    await alert.present();
  }

  revisionPublicaciones() {
    this.showMenu = false;
    this.router.navigate(['/revision']);
  }
}
