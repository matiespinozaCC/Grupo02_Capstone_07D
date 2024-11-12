import { Component, OnInit } from '@angular/core';
import { PostService } from '../servicios/post.service';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';

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
  opciones = [
    { icon: 'sunny' },
    { icon: 'water' },
    { icon: 'leaf' },
    { icon: 'trail-sign' },
  ];

  constructor(
    private postService: PostService, 
    private router: Router, 
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUserPosts();
    this.loadUserProfile();  // Cargar el perfil del usuario
  }

  async loadUserPosts() {
    try {
      this.posts = await this.postService.getPostsByUser();
    } catch (error) {
      console.error('Error al cargar las publicaciones del usuario:', error);
    }
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

  verDetalles(postId: string) {
    this.router.navigate(['/detalle-publicacion', postId]);
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
