// perfil.page.ts
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
  posts: any[] = []; // Aquí guardaremos los posts del usuario

  constructor(private postService: PostService, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.loadUserPosts();
  }

  async loadUserPosts() {
    try {
      this.posts = await this.postService.getPostsByUser(); // Cargar posts del usuario
    } catch (error) {
      console.error('Error al cargar las publicaciones del usuario:', error);
    }
  }

  verDetalles(postId: string) {
    this.router.navigate(['/detalle-publicacion', postId]);
  }

  goToPostDetail(postId: string) {
    console.log('Navigating to post with ID:', postId); // Log para verificar el ID
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
