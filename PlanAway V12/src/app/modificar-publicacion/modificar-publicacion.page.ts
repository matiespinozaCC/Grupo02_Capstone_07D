import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../servicios/post.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-modificar-publicacion',
  templateUrl: './modificar-publicacion.page.html',
  styleUrls: ['./modificar-publicacion.page.scss'],
})
export class ModificarPublicacionPage implements OnInit {
  post: any = {}; // Información del post cargada
  postId: string; // ID del post a modificar
  isLoading: boolean = false; // Estado de carga
  categorias: string[] = ['Piscina', 'Quincho', 'Terraza', 'Departamento']; // Opciones para categoría

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController // Servicio para mostrar alertas
  ) {
    this.postId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit() {
    this.cargarPost();
  }

  // Carga los datos de la publicación desde el servicio
  async cargarPost() {
    this.isLoading = true;
    try {
      this.post = await this.postService.getPostById(this.postId);
    } catch (error) {
      console.error('Error al cargar la publicación:', error);
      this.mostrarAlertaError('No se pudo cargar la publicación. Inténtalo más tarde.');
    } finally {
      this.isLoading = false;
    }
  }

  // Método para modificar la publicación
  async modificarPost() {
    if (!this.post.title || !this.post.description || !this.post.category) {
      this.mostrarAlertaError('Todos los campos son obligatorios.');
      return;
    }

    this.isLoading = true;
    try {
      await this.postService.updatePost(this.postId, this.post);
      this.mostrarAlertaExito('Publicación modificada con éxito.');
      this.router.navigate(['tabs/perfil']); // Redirigir al perfil
    } catch (error) {
      console.error('Error al modificar el post:', error);
      this.mostrarAlertaError('No se pudo modificar la publicación. Inténtalo más tarde.');
    } finally {
      this.isLoading = false;
    }
  }

  // Mostrar alerta de error
  async mostrarAlertaError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK'],
      cssClass: 'custom-alert-error',
    });
    await alert.present();
  }

  // Mostrar alerta de éxito
  async mostrarAlertaExito(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: mensaje,
      buttons: ['OK'],
      cssClass: 'custom-alert-success',
    });
    await alert.present();
  }
}
