import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { PostService } from '../servicios/post.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const apiKey = environment.googleMapsApiKey;

declare var google: any;

@Component({
  selector: 'app-crearpost',
  templateUrl: './crearpost.page.html',
  styleUrls: ['./crearpost.page.scss'],
})
export class CrearpostPage implements AfterViewInit {
  title: string = '';
  description: string = '';
  category: string = '';
  capacity: number | null = null;
  imageFile: File | null = null;
  price: number | null = null;
  searchTerm: string = '';
  errorMessage: string = '';
  address: string = ''; // Dirección ingresada
  lat: number = 0;  // Coordenada predeterminada
  lng: number = 0;  // Coordenada predeterminada
  map: any;
  autocomplete: any;
  selectedAdicionales: string[] = [];
  allAdicionales = [
    { name: 'Agua', price: 500 },
    { name: 'Jacuzzi', price: 1000 },
    { name: 'Alimentos', price: 1500 }
  ];
  
  // Lista de categorías
  allCategories: string[] = ['piscina', 'quincho', 'terraza', 'departamento'];
  filteredCategories: string[] = this.allCategories;

  @ViewChild('addressInput', { static: false }) addressInput!: ElementRef;

  constructor(private postService: PostService, private router: Router) {}

  onBack() {
    this.router.navigate(['tabs/home']);
  }

  ngAfterViewInit() {
    this.initMap();
    this.initAutocomplete();
  }

  initMap() {
    // Inicializa el mapa con una ubicación predeterminada
    const mapOptions = {
      center: { lat: -33.4489, lng: -70.6693 }, // Santiago, Chile
      zoom: 13,
    };
    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  initAutocomplete() {
    // Inicializa el autocompletado
    this.autocomplete = new google.maps.places.Autocomplete(this.addressInput.nativeElement, {
      types: ['address'],
    });
    this.autocomplete.bindTo('bounds', this.map);

    // Actualiza el mapa cada vez que se selecciona una dirección
    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace();
      if (!place.geometry) {
        console.log('Error al obtener ubicación');
        return;
      }

      // Configurar el mapa para mostrar la ubicación seleccionada
      this.map.setCenter(place.geometry.location);
      this.map.setZoom(15);

      // Guardar latitud, longitud y dirección
      this.address = place.formatted_address;
      this.lat = place.geometry.location.lat();
      this.lng = place.geometry.location.lng();

      // Añadir un marcador en la ubicación seleccionada
      new google.maps.Marker({
        position: place.geometry.location,
        map: this.map,
      });
    });
  }

  // Método para filtrar categorías
  filterCategories() {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredCategories = this.allCategories.filter(category =>
      category.toLowerCase().includes(searchTermLower)
    );
  }

  // Método para manejar la selección de imagen
  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0]; // Guardar el archivo de imagen seleccionado
    } else {
      this.imageFile = null; // Reiniciar si no hay archivo
    }
  }

  async onCreatePost() {
    if (!this.title || !this.description || !this.category || this.capacity === null || this.imageFile === null) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return;
    }
  
    if (this.price === null || this.price <= 0) {
      this.errorMessage = 'El precio debe ser un valor positivo';
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
        this.address, // Guardar la dirección (asegurarse de que el tipo coincida en `createPost`)
        Number(this.lat), // Convertir latitud a número
        Number(this.lng)  // Convertir longitud a número
      );
      this.router.navigate(['/tabs/home']);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.errorMessage = 'Error al crear el post: ' + error.message;
      } else {
        this.errorMessage = 'Error desconocido al crear el post';
      }
    }
  }
  
}
