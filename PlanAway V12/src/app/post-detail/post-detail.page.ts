import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../servicios/post.service';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { PayPalService } from '../servicios/paypal.service';

declare var google: any;

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.page.html',
  styleUrls: ['./post-detail.page.scss'],
})
export class PostDetailPage implements OnInit, AfterViewInit {
  post: any;
  loading: boolean = true;
  fechaInicio: string | undefined;
  fechaFin: string | undefined;
  seleccionandoFechaInicio: boolean = true;
  reservaMensaje: string = '';
  showFullDescription: boolean = false;
  paragraphs: string[] = [];
  comments: any[] = [];
  newComment: string = '';
  map: any;
  searchBox: any;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private router: Router,
    public authService: AuthService,
    private paypalService: PayPalService
  ) { }

  async ngOnInit() {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      try {
        this.post = await this.postService.getPostById(postId);
        this.paragraphs = this.post.description.split('\n');
        await this.loadComments(postId);
      } catch (error) {
        console.error('Error al obtener el post:', error);
      }
    } else {
      console.error('El postId es null o inválido');
    }
  }

  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('Elemento del mapa no encontrado');
      return;
    }
  
    const defaultLocation = { lat: -33.4489, lng: -70.6693 };
    this.map = new google.maps.Map(mapElement, {
      center: defaultLocation,
      zoom: 12,
    });
  
    const input = document.getElementById('searchBox') as HTMLInputElement;
    if (input) {
      this.searchBox = new google.maps.places.SearchBox(input);
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  
      this.searchBox.addListener('places_changed', () => {
        const places = this.searchBox.getPlaces();
        if (places && places.length > 0) {
          const place = places[0];
          if (place.geometry) {
            this.map.panTo(place.geometry.location);
            this.map.setZoom(15);
            this.post.lat = place.geometry.location.lat();
            this.post.lng = place.geometry.location.lng();
          }
        }
      });
    } else {
      console.error('Input de búsqueda no encontrado');
    }
  }
  

  async loadPostData(postId: string) {
    try {
      this.post = await this.postService.getPostById(postId);
    } catch (error) {
      console.error('Error al obtener el post:', error);
    }
  }

  async loadComments(postId: string) {
    this.comments = await this.postService.getCommentsByPostId(postId);
    console.log('Comentarios cargados:', this.comments);
  }

  

  async addComment() {
    if (this.newComment.trim() === '') return;

    try {
      await this.postService.addComment(this.post.id, this.newComment);
      this.newComment = ''; // Limpiar el campo de texto
      await this.loadComments(this.post.id); // Recargar los comentarios
    } catch (error) {
      console.error('Error al agregar comentario:', error);
    }
  }

  //efecto de descricion

  onScroll(event: any) {
    const element = event.target as HTMLElement;
    const overlay = document.querySelector('.fade-overlay') as HTMLElement;
    const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 1;
    
    if (isAtBottom) {
      overlay.classList.add('hide-fade');
    } else {
      overlay.classList.remove('hide-fade');
    }
  }


  updateDate(event: any) {
    const selectedDate = event.detail.value;
    if (this.seleccionandoFechaInicio) {
      this.fechaInicio = selectedDate;
      this.seleccionandoFechaInicio = false; // Cambiar para que la siguiente fecha sea la fecha de fin
      this.reservaMensaje = 'Selecciona la fecha de fin';
    } else {
      this.fechaFin = selectedDate;
      this.seleccionandoFechaInicio = true; // Resetear para futuras selecciones
      this.reservaMensaje = 'Fechas seleccionadas correctamente';
    }
  }

  async reservar() {
    if (!this.fechaInicio || !this.fechaFin) {
      this.reservaMensaje = 'Por favor, selecciona ambas fechas.';
      return;
    }

    const fechaInicioDate = new Date(this.fechaInicio);
    const fechaFinDate = new Date(this.fechaFin);

    if (fechaInicioDate > fechaFinDate) {
      this.reservaMensaje = 'La fecha de inicio no puede ser posterior a la fecha de fin.';
      return;
    }

    const usuario = await this.authService.getCurrentUser();
    if (!usuario) {
      this.reservaMensaje = 'Usuario no autenticado. Por favor, inicia sesión.';
      return;
    }

    const postId = this.post.id;
    const disponible = await this.postService.verificarDisponibilidad(postId, fechaInicioDate, fechaFinDate);
    if (!disponible) {
      this.reservaMensaje = 'Las fechas seleccionadas no están disponibles.';
      return;
    }

    const costoPesos = this.post.price;
    const comision = costoPesos * 0.1;
    const totalPesos = costoPesos;
    const tasaConversion = 900;
    const totalDolares = totalPesos / tasaConversion;

    const pagoExitoso = await this.paypalService.iniciarPago(totalDolares);
    if (pagoExitoso) {
      await this.postService.reservarPropiedad(postId, fechaInicioDate, fechaFinDate, usuario.uid);
      const saldoPropietario = costoPesos - comision;
      await this.authService.actualizarSaldo(this.post.ownerId, saldoPropietario);
      this.reservaMensaje = 'Reserva realizada con éxito.';
    } else {
      this.reservaMensaje = 'El pago no se pudo completar. Reserva no realizada.';
    }
  }

  onBack() {
    this.router.navigate(['tabs/home']); // Ajusta la ruta según sea necesario
  }
}

