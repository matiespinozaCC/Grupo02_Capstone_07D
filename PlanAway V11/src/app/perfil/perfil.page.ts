import { Component, OnInit } from '@angular/core';
import { PostService } from '../servicios/post.service';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { ModalController } from '@ionic/angular';
import { ImageModalComponent } from '../image-modal/image-modal.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  posts: any[] = [];
  nombre: string = '';
  telefono: string = '';
  profileImage: string = '';
  favoritePostIds: string[] = [];
  showFavoritesOnly = false;

  constructor(
    private postService: PostService,
    private router: Router,
    private authService: AuthService,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    this.loadFavoritePostIds();
  }

  async loadUserPosts() {
    try {
      this.posts = await this.postService.getPostsByUser();
    } catch (error) {
      console.error('Error al cargar las publicaciones del usuario:', error);
    }
  }
  
  loadFavoritePostIds() {
    this.favoritePostIds = this.postService.getFavoritePostIds();
  }

  toggleFavorite(postId: string) {
    this.postService.toggleFavorite(postId);
    this.loadFavoritePostIds(); // Actualiza los IDs de favoritos
  }

  isFavorite(postId: string): boolean {
    return this.favoritePostIds.includes(postId);
  }

  get filteredPosts() {
    return this.showFavoritesOnly
      ? this.posts.filter(post => this.isFavorite(post.id))
      : this.posts;
  }

  async loadUserProfile() {
    try {
      const profile = await this.authService.getUserProfile();
      if (profile) {
        this.nombre = profile.nombre || 'Nombre no especificado';
        this.telefono = profile.telefono || 'Teléfono no especificado';
        this.profileImage = profile.profileImageUrl || 'ruta/por/defecto/de/imagen.png';
      }
    } catch (error) {
      console.error('Error al cargar el perfil del usuario:', error);
    }
  }

  async openImageModal() {
    const modal = await this.modalController.create({
      component: ImageModalComponent,
      componentProps: { imageSrc: this.profileImage },
      cssClass: 'image-modal'
    });

    modal.onDidDismiss().then((data) => {
      const newImageUrl = data.data;
      if (newImageUrl) {
        this.profileImage = newImageUrl;
      }
    });

    await modal.present();
  }

  verDetalles(postId: string) {
    this.router.navigate(['/detalle-publicacion', postId]);
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
