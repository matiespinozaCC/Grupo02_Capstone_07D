import { Component } from '@angular/core';
import { PostService } from '../services/post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-post',
  templateUrl: './crear-post.page.html',
  styleUrls: ['./crear-post.page.scss'],
})
export class CrearPostPage {
  title: string = '';
  description: string = '';
  category: string = '';
  errorMessage: string = '';

  constructor(private postService: PostService, private router: Router) {}

  async onCreatePost() {
    try {
      await this.postService.createPost(this.title, this.description, this.category);
      this.router.navigate(['/posts']); // Redirigir a la lista de posts
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.errorMessage = 'Error al crear el post: ' + error.message;
      } else {
        this.errorMessage = 'Error desconocido al crear el post';
      }
    }
  }  
}
