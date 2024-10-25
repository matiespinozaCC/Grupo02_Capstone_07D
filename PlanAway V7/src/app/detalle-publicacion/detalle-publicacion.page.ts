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
  reservas: any[] = []; // Nueva propiedad para almacenar las reservas

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.postId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit() {
    this.cargarPost();
    this.cargarReservas(); // Cargar reservas cuando se inicializa el componente
  }

  async cargarPost() {
    try {
      this.post = await this.postService.getPostById(this.postId);
    } catch (error) {
      console.error('Error al cargar la publicación:', error);
    }
  }

  async cargarReservas() {
    try {
      this.reservas = await this.postService.getReservasByPostId(this.postId); // Cargar reservas por ID de publicación
    } catch (error) {
      console.error('Error al cargar las reservas:', error);
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
