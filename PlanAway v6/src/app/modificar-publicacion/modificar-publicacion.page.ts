import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../servicios/post.service';

@Component({
  selector: 'app-modificar-publicacion',
  templateUrl: './modificar-publicacion.page.html',
  styleUrls: ['./modificar-publicacion.page.scss'],
})
export class ModificarPublicacionPage implements OnInit {
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

  async modificarPost() {
    try {
      await this.postService.updatePost(this.postId, this.post);
      this.router.navigate(['/perfil']); // Volver al perfil después de modificar
    } catch (error) {
      console.error('Error al modificar el post:', error);
    }
  }
}
