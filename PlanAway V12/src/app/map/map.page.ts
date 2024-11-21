import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { PostService } from '../servicios/post.service';

declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  map: any;
  mapainicializado: boolean = false;

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit() {
    this.loadMap();
  }

  async loadMap() {
    
    const mapOptions = {
      center: { lat: -33.04823, lng: -71.3729 },
      zoom: 12,
    };

    
    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    try {
      const posts = await this.postService.getPosts();
      this.addMarkers(posts);
    } catch (error) {
      console.error('Error al cargar las publicaciones en el mapa:', error);
    }
  }

  addMarkers(posts: any[]) {
    posts.forEach((post) => {
      if (post.lat && post.lng) {
        const marker = new google.maps.Marker({
          position: { lat: post.lat, lng: post.lng },
          map: this.map,
          title: post.title,
          icon: {
            url: post.imageUrl,
            scaledSize: new google.maps.Size(60, 60),
          },
        });
  
        
        marker.addListener('click', () => {
          this.router.navigate(['tabs/post-detail', post.id]);
        });
      }
    });
  }

  destuirmapa() {
    if (this.map) {
      const mapContainer = document.getElementById('map');
      if (mapContainer) {
        mapContainer.innerHTML = '';
      }
      this.mapainicializado = false;
    }
  }

  ionViewWillEnter() {
    const reloaded = localStorage.getItem('mapReloaded');
  
    if (!reloaded) {
      localStorage.setItem('mapReloaded', 'true');
      location.reload();
    } else {
      localStorage.removeItem('mapReloaded');
      this.loadMap();
    }
  }
  

  ionViewWillLeave() {
    this.destuirmapa();
  }

  ngOnDestroy() {
    this.destuirmapa();
  }
  
}
