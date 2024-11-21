import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../servicios/post.service';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { PayPalService } from '../servicios/paypal.service';
import { environment } from 'src/environments/environment';

const apiKey = environment.googleMapsApiKey;

declare var google: any;

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.page.html',
  styleUrls: ['./post-detail.page.scss'],
})
export class PostDetailPage implements OnInit, AfterViewInit, OnDestroy {
  post: any;
  loading: boolean = true;
  fechaInicio: string | null = null;
  fechaFin: string | null = null;
  seleccionandoFechaInicio: boolean = true;
  reservaMensaje: string = '';
  showFullDescription: boolean = false;
  paragraphs: string[] = [];
  comments: any[] = [];
  newComment: string = '';
  map: any;
  searchBox: any;
  mapainicializado: boolean = false

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
    this.route.paramMap.subscribe(async (params) => {
      const postId = params.get('id');
      if (postId) {
        try {
          this.post = await this.postService.getPostById(postId);
          if (this.post.lat && this.post.lng) {
            this.initMap(this.post.lat, this.post.lng);
          } else {
            console.warn('Coordenadas no disponibles para el mapa.');
          }
        } catch (error) {
          console.error('Error al obtener el post:', error);
        }
      } else {
        console.error('El postId es nulo o inválido.');
      }
    });
  }

  ionViewWillEnter() {
    const reloaded = localStorage.getItem('mapReloaded');
  
    if (!reloaded) {
      localStorage.setItem('mapReloaded', 'true');
      location.reload();
    } else {
      localStorage.removeItem('mapReloaded');
      this.initMap;
    }
  }

  
initMap(lat: number, lng: number) {
  const location = { lat, lng };

  this.map = new google.maps.Map(document.getElementById('map'), {
    center: location,
    zoom: 15,
  });

  new google.maps.Marker({
    position: location,
    map: this.map,
    title: this.post.title || 'Ubicación de la publicación',
  });
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


  getFechaFormateada(fechaString: string | null): string {
    if (!fechaString) return 'No seleccionada'; // Si no hay fecha, retorna este texto
    const fecha = new Date(fechaString); // Convierte la cadena de texto en objeto Date
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long', // Día de la semana
      year: 'numeric', // Año
      month: 'long', // Mes
      day: 'numeric', // Día del mes
    }).format(fecha); // Devuelve la fecha formateada
  }
  
  // Evento para manejar la selección de la fecha de inicio
  onFechaInicioSeleccionada(evento: any) {
    this.fechaInicio = evento.detail.value; // Guarda la fecha seleccionada
    console.log('Fecha de inicio seleccionada:', this.getFechaFormateada(this.fechaInicio));
    this.seleccionandoFechaInicio = false;
  }
  
  // Evento para manejar la selección de la fecha de fin
  onFechaFinSeleccionada(evento: any) {
    this.fechaFin = evento.detail.value; // Guarda la fecha seleccionada
    this.seleccionandoFechaInicio = true;
    console.log('Fecha de fin seleccionada:', this.getFechaFormateada(this.fechaFin));
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

  destroyMap() {
    if (this.map) {
      const mapContainer = document.getElementById('map');
      if (mapContainer) {
        mapContainer.innerHTML = ''; // Limpia el contenedor del mapa
      }
      this.mapainicializado = false;
    }
  }

  ngOnDestroy() {
    this.destroyMap();
  }
}

