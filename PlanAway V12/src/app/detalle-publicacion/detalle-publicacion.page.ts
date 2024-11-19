import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../servicios/post.service';
import { AuthService } from '../servicios/auth.service';
import { AlertController } from '@ionic/angular';

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
    private authService: AuthService,
    private alertController: AlertController
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
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas eliminar esta publicación?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada'); // Solo para debug
          }
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            try {
              // Llama al servicio o método para eliminar el post
              console.log('Eliminando publicación...');
              // Aquí puedes ejecutar la lógica de eliminación
              await this.eliminarPublicacion(); // Método que elimina la publicación
              console.log('Publicación eliminada con éxito');
            } catch (error) {
              console.error('Error al eliminar publicación:', error);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async eliminarPublicacion() {
    // Lógica de eliminación
    console.log('Publicación eliminada (simulación).');
    // Aquí puedes incluir el servicio HTTP o lógica que elimina el post.
  }

  irModificar() {
    this.router.navigate(['/modificar-publicacion', this.postId]);
  }
}
