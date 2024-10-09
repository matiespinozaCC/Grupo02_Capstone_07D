import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../servicios/post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.page.html',
  styleUrls: ['./post-detail.page.scss'],
})
export class PostDetailPage implements OnInit {
  post: any; // Propiedad para almacenar el post
  loading: boolean = true; // Estado de carga

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private router: Router
  ) {}

  async ngOnInit() {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      try {
        this.post = await this.postService.getPostById(postId);
      } catch (error) {
        console.error('Error al obtener el post:', error);
        // Aquí podrías mostrar un mensaje al usuario
      } finally {
        this.loading = false; // Cambia el estado de carga
      }
    } else {
      console.error('El postId es null o inválido');
      this.loading = false; // Cambia el estado de carga
    }
  }

  onBack() {
    this.router.navigate(['/home']); // Ajusta la ruta según sea necesario
  }
  
}
