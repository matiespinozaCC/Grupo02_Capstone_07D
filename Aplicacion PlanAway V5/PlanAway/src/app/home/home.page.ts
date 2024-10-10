import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { Router } from '@angular/router';
import { PostService } from '../servicios/post.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  posts: any[] = [];
  categories: any[] = [];
  filteredCategories: any[] = []; // Almacena las categorías filtradas
  selectedCategory: string = ''; // Almacena la categoría seleccionada

  constructor(private postService: PostService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.loadPosts();
  }

  async loadPosts() {
    this.posts = await this.postService.getPosts();
    console.log('Loaded posts:', this.posts);
    this.groupPostsByCategory();
    this.filteredCategories = this.categories; // Inicialmente, muestra todas las categorías
  }

  groupPostsByCategory() {
    const categoriesMap: { [key: string]: { name: string; posts: any[] } } = {};
    this.posts.forEach(post => {
      const category = post.category || 'Sin categoría';
      if (!categoriesMap[category]) {
        categoriesMap[category] = { name: category, posts: [] };
      }
      categoriesMap[category].posts.push(post);
    });
    this.categories = Object.values(categoriesMap);
  }

  filterPosts() {
    // Filtrar categorías según la categoría seleccionada
    if (this.selectedCategory) {
      this.filteredCategories = this.categories.filter(category => category.name === this.selectedCategory);
    } else {
      this.filteredCategories = this.categories; // Si no hay categoría seleccionada, mostrar todas
    }
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
