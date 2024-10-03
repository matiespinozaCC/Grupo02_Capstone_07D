// src/app/posts/posts.page.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { PostService } from '../services/post.service'; // Importa el servicio de posts

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
})
export class PostsPage implements OnInit {
  posts: any[] = [];
  filteredPosts: any[] = [];
  searchTerm: string = '';

  constructor(private postService: PostService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loadPosts();
  }

  async loadPosts() {
    this.posts = await this.postService.getPosts();
    this.filteredPosts = this.posts; // Inicialmente, muestra todos los posts
  }

  filterPosts() {
    if (!this.searchTerm) {
      this.filteredPosts = this.posts;
    } else {
      this.filteredPosts = this.posts.filter(post => 
        post.category && post.category.toLowerCase().includes(this.searchTerm.toLowerCase()) // Verifica si category está definido
      );
    }
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
