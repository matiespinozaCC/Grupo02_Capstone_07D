import { Component, OnInit } from '@angular/core';
import { PostService } from '../servicios/post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crearpost',
  templateUrl: './crearpost.page.html',
  styleUrls: ['./crearpost.page.scss'],
})
export class CrearpostPage {

  title: string = '';
  description: string = '';
  category: string = '';
  searchTerm: string = '';
  errorMessage: string = '';

  // Lista de categorías
  allCategories: string[] = ['piscina', 'quincho', 'terraza', 'departamento'];
  filteredCategories: string[] = this.allCategories;

  constructor(private postService: PostService, private router: Router) { }

  onBack() {
    this.router.navigate(['/home']); // Ajusta la ruta según sea necesario
  }

  // Método para filtrar categorías
  filterCategories() {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredCategories = this.allCategories.filter(category =>
      category.toLowerCase().includes(searchTermLower)
    );
  }

  async onCreatePost() {
    try {
      await this.postService.createPost(this.title, this.description, this.category);
      this.router.navigate(['/home']); // Redirigir a la lista de posts
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.errorMessage = 'Error al crear el post: ' + error.message;
      } else {
        this.errorMessage = 'Error desconocido al crear el post';
      }
    }
  }

}
