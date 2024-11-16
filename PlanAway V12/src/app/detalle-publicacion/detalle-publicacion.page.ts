import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../servicios/post.service';
import { AuthService } from '../servicios/auth.service';

declare var google: any;

@Component({
  selector: 'app-detalle-publicacion',
  templateUrl: './detalle-publicacion.page.html',
  styleUrls: ['./detalle-publicacion.page.scss'],
})
export class DetallePublicacionPage implements OnInit, AfterViewInit {
  post: any = {};
  postId: string;
  reservas: any[] = [];
  map: any;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.postId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit() {
    this.cargarPost();
    this.cargarReservas();
    
  }

  ngAfterViewInit() {
    this.cargarMapa();
  }

  async cargarPost() {
    try {
      this.post = await this.postService.getPostById(this.postId);
      if (this.post.lat && this.post.lng) {
        this.cargarMapa();
      }
    } catch (error) {
      console.error('Error al cargar la publicación:', error);
    }
  }
  

  async cargarReservas() {
    try {
      this.reservas = await this.postService.getReservasByPostId(this.postId);
    } catch (error) {
      console.error('Error al cargar las reservas:', error);
    }
  }

  cargarMapa() {
    if (!this.post || !this.post.lat || !this.post.lng) {
      console.error('Coordenadas no disponibles para el mapa.');
      return;
    }

    const location = { lat: this.post.lat, lng: this.post.lng };
    const mapOptions = {
      center: location,
      zoom: 15,
    };
    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Agregar un marcador en la ubicación de la publicación
    new google.maps.Marker({
      position: location,
      map: this.map,
      title: this.post.title,
    });
  }

  async eliminarPost() {
    try {
      await this.postService.deletePost(this.postId);
      this.router.navigate(['/perfil']);
    } catch (error) {
      console.error('Error al eliminar el post:', error);
    }
  }

  irModificar() {
    this.router.navigate(['/modificar-publicacion', this.postId]);
  }
}
