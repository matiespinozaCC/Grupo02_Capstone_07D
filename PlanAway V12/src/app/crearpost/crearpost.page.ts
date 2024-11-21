import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { PostService } from '../servicios/post.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';

const apiKey = environment.googleMapsApiKey;

declare var google: any;

@Component({
  selector: 'app-crearpost',
  templateUrl: './crearpost.page.html',
  styleUrls: ['./crearpost.page.scss'],
})
export class CrearpostPage implements AfterViewInit {
  @ViewChild('map', { static: false }) mapElement!: ElementRef;
  @ViewChild('addressInput', { static: false }) addressInput!: ElementRef;
  showSuccessToast: boolean = false;

  title: string = '';
  description: string = '';
  category: string = '';
  capacity: number | null = null;
  imageFile: File | null = null; // Archivo de imagen
  price: number | null = null;
  errorMessage: string = '';
  address: string = '';
  lat: number = 0;
  lng: number = 0;
  map: any;
  searchBox: any;

  allCategories: string[] = ['piscina', 'quincho', 'terraza', 'departamento'];
  filteredCategories: string[] = this.allCategories;

  constructor(private postService: PostService, private router: Router, private alertController: AlertController) {}

  onBack() {
    this.router.navigate(['tabs/home']);
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['Okey'],
      cssClass: 'custom-alert-error'
    });
  
    await alert.present(); // Presenta la alerta
  }
  

  ngAfterViewInit() {
    this.initMap();
  }
  

  initMap() {
    const defaultLocation = { lat: -33.0433, lng: -71.3735 }; // Villa Alemana
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: defaultLocation,
      zoom: 13,
      mapTypeId: 'roadmap',
    });
  
    const input = document.getElementById('pac-input') as HTMLInputElement;
    const searchBox = new google.maps.places.SearchBox(input);
  
    // Actualiza los resultados de búsqueda en función de los límites visibles del mapa
    this.map.addListener('bounds_changed', () => {
      searchBox.setBounds(this.map.getBounds() as google.maps.LatLngBounds);
    });
  
    let markers: google.maps.Marker[] = [];
  
    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
  
      if (!places || places.length === 0) {
        console.log('No se encontraron lugares.');
        return;
      }
  
      // Eliminar marcadores existentes
      markers.forEach(marker => marker.setMap(null));
      markers = [];
  
      const bounds = new google.maps.LatLngBounds();
  
      places.forEach((place: google.maps.places.PlaceResult) => {
        if (!place.geometry || !place.geometry.location) {
          console.log('Lugar sin geometría.');
          return;
        }
  
        // Crear un marcador en el lugar seleccionado
        markers.push(
          new google.maps.Marker({
            map: this.map,
            title: place.name,
            position: place.geometry.location,
          })
        );
  
        // Ajustar los límites del mapa al lugar seleccionado
        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
  
        // Guardar la dirección, latitud y longitud
        this.address = place.formatted_address || '';
        this.lat = place.geometry.location.lat();
        this.lng = place.geometry.location.lng();
      });
  
      this.map.fitBounds(bounds);
    });
  }
  
  

  // Método para manejar la selección de imagen
  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0]; // Guardar el archivo de imagen seleccionado
    } else {
      this.imageFile = null; // Reiniciar si no hay archivo seleccionado
    }
  }

  async onCreatePost() {
    if (!this.title || !this.description || !this.category || this.capacity === null || this.imageFile === null) {
      await this.showErrorAlert('Todos los campos son obligatorios');
      return;
    }

    if (this.price === null || this.price <= 0) {
      await this.showErrorAlert('El precio debe ser un valor positivo');
      return;
    }

    try {
      await this.postService.createPost(
        this.title,
        this.description,
        this.category,
        this.price,
        this.capacity,
        this.imageFile,
        this.address,
        this.lat,
        this.lng
      );

      // Muestra el toast de éxito
      this.showSuccessToast = true;

      // Navega al home después de un pequeño retraso
      setTimeout(() => {
        this.router.navigate(['/tabs/home']);
      }, 3000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        await this.showErrorAlert('Error al crear el post: ' + error.message);
      } else {
        await this.showErrorAlert('Error desconocido al crear el post');
      }
    }
  }
}
