import { Component, OnInit } from '@angular/core';
import { PostService } from '../servicios/post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-revision',
  templateUrl: './revision.page.html',
  styleUrls: ['./revision.page.scss'],
})
export class RevisionPage implements OnInit {

  pendingPosts: any[] = [];

  constructor(private postService: PostService, private router: Router) { }

  ngOnInit() {
    this.loadPendingPosts();
  }

  async loadPendingPosts() {
    this.pendingPosts = await this.postService.getPendingPosts();
  }

  async approvePost(postId: string) {
    await this.postService.approvePost(postId);
    this.loadPendingPosts(); // Recargar los posts pendientes
  }

  async deletePost(postId: string) {
    await this.postService.deletePost(postId);
    this.loadPendingPosts(); // Recargar los posts pendientes
  }

  logout() {
    // Implementa tu lógica de cierre de sesión
    this.router.navigate(['/login']);
  }
}
