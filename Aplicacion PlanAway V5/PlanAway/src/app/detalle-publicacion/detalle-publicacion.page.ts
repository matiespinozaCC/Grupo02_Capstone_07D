import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../servicios/post.service';

@Component({
  selector: 'app-detalle-publicacion',
  templateUrl: './detalle-publicacion.page.html',
  styleUrls: ['./detalle-publicacion.page.scss'],
})
export class DetallePublicacionPage implements OnInit {
  post: any = {};
  postId: string;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.postId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit() {
    this.cargarPost();
  }

  async cargarPost() {
    try {
      this.post = await this.postService.getPostById(this.postId);
    } catch (error) {
      console.error('Error al cargar la publicación:', error);
    }
  }

  async eliminarPost() {
    try {
      await this.postService.deletePost(this.postId);
      this.router.navigate(['/perfil']); // Volver al perfil después de eliminar
    } catch (error) {
      console.error('Error al eliminar el post:', error);
    }
  }

  irModificar() {
    this.router.navigate(['/modificar-publicacion', this.postId]); // Navegar a la página de modificación
  }
}
