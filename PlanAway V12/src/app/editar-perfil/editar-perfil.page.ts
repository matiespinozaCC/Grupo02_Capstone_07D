import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
})
export class EditarPerfilPage implements OnInit {
  name: string = '';
  email: string = '';
  phone: string = '';
  profileImage: string = '';
  selectedFile: File | null = null;

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  constructor(private authService: AuthService, private router: Router,private toastController: ToastController)  {}

  async ngOnInit() {
    this.loadUserProfile();
  }

  async loadUserProfile() {
    try {
      const user = await this.authService.getCurrentUser();
      if (!user) {
        console.error('No hay un usuario autenticado');
        return;
      }
  
      const profile = await this.authService.getUserProfile();
      if (profile) {
        this.name = profile.nombre || 'Nombre no especificado';
        this.email = profile.email || 'Correo no especificado';
        this.phone = profile.telefono || 'Teléfono no especificado';
        this.profileImage = profile.profileImageUrl || 'ruta/por/defecto/de/imagen.png';
      }
    } catch (error) {
      console.error('Error al cargar el perfil del usuario:', error);
    }
  }
  

  changeProfilePicture() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file; 
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async saveProfile() {
    try {
      let profileImageUrl = this.profileImage;

      if (this.selectedFile) {
        profileImageUrl = await this.authService.uploadProfileImage(this.selectedFile);
      }

      await this.authService.updateUserProfile({
        name: this.name,
        phone: this.phone,
        profileImage: profileImageUrl,
      });

      
      this.mostrarToast('Los cambios se guardaron con éxito');
      this.router.navigate(['/tabs/perfil']);
    } catch (error) {
      console.error('Error al guardar los cambios del perfil:', error);
    }
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'top',
      color: 'success',
    });
    await toast.present();
  }

  cancelEdit() {
    this.router.navigate(['/tabs/perfil']);
  }
}
