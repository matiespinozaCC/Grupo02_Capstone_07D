import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { PostService } from '../servicios/post.service';

declare var google: any; // Para evitar errores de typings con la API de Google Maps

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  map: any;

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit() {
    this.loadMap();
  }

  async loadMap() {
    
    const mapOptions = {
      center: { lat: -33.04823, lng: -71.3729 },
      zoom: 12,
    };

    // Inicializa el mapa
    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    try {
      // Obtén las publicaciones desde el servicio
      const posts = await this.postService.getPosts();
      this.addMarkers(posts);
    } catch (error) {
      console.error('Error al cargar las publicaciones en el mapa:', error);
    }
  }

  addMarkers(posts: any[]) {
    posts.forEach((post) => {
      if (post.lat && post.lng) {
        // Crear el marcador con las coordenadas y la imagen del post
        const marker = new google.maps.Marker({
          position: { lat: post.lat, lng: post.lng },
          map: this.map,
          title: post.title,
          icon: {
            url: post.imageUrl,
            scaledSize: new google.maps.Size(30, 30),
          },
        });
  
        // Agrega un evento de clic al marcador
        marker.addListener('click', () => {
          // Redirige al detalle del post con el ID del post
          this.router.navigate(['tabs/post-detail', post.id]);
        });
      }
    });
  }
  
}
