import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../servicios/post.service';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { PayPalService } from '../servicios/paypal.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.page.html',
  styleUrls: ['./post-detail.page.scss'],
})
export class PostDetailPage implements OnInit {
  post: any;
  loading: boolean = true;
  fechaInicio: string | undefined;
  fechaFin: string | undefined;
  reservaMensaje: string = '';
  showFullDescription: boolean = false;
  paragraphs: string[] = [];
  comments: any[] = [];
  newComment: string = '';

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

  async loadComments(postId: string) {
    this.comments = await this.postService.getCommentsByPostId(postId);
    console.log('Comentarios cargados:', this.comments); // Verifica si los comentarios están llegando
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

  //efecto tonto pero me daba tock verlo tan plano 

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


  async reservar() {
    if (!this.fechaInicio || !this.fechaFin) {
      this.reservaMensaje = 'Por favor, selecciona ambas fechas.';
      return;
    }
  
    // Convertir las fechas a objetos Date
    const fechaInicioDate = new Date(this.fechaInicio);
    const fechaFinDate = new Date(this.fechaFin);
  
    // Validar que la fecha de inicio no sea posterior a la fecha de fin
    if (fechaInicioDate > fechaFinDate) {
      this.reservaMensaje = 'La fecha de inicio no puede ser posterior a la fecha de fin.';
      return;
    }
  
    const usuario = await this.authService.getCurrentUser(); // Obtener usuario actual
    if (!usuario) {
      this.reservaMensaje = 'Usuario no autenticado. Por favor, inicia sesión.';
      return;
    }
  
    const postId = this.post.id;
  
    // Verificar disponibilidad
    const disponible = await this.postService.verificarDisponibilidad(postId, fechaInicioDate, fechaFinDate);
    if (!disponible) {
      this.reservaMensaje = 'Las fechas seleccionadas no están disponibles.';
      return;
    }
  
    // Calcular el costo y el saldo a debitar
    const costoPesos = this.post.price; // Asegúrate de que este campo existe en tu post
    const comision = costoPesos * 0.1; // 10% de comisión
    const totalPesos = costoPesos; // Total que se pagará (costo completo)
  
    // Conversión de pesos a dólares
    const tasaConversion = 900; // 1 dólar = 900 pesos
    const totalDolares = totalPesos / tasaConversion; // Convertir a dólares
  
    // Iniciar el proceso de pago
    const pagoExitoso = await this.paypalService.iniciarPago(totalDolares); // Pasar el total en dólares a PayPal
    if (pagoExitoso) {
      await this.postService.reservarPropiedad(postId, fechaInicioDate, fechaFinDate, usuario.uid);
      
      // Actualizar el saldo del dueño de la propiedad (costo menos comisión en pesos)
      const saldoPropietario = costoPesos - comision; // Saldo que se sumará al dueño de la propiedad
      await this.authService.actualizarSaldo(this.post.ownerId, saldoPropietario); // Asegúrate de tener el ownerId del post
      this.reservaMensaje = 'Reserva realizada con éxito.';
    } else {
      this.reservaMensaje = 'El pago no se pudo completar. Reserva no realizada.';
    }
  }

  onBack() {
    this.router.navigate(['tabs/home']); // Ajusta la ruta según sea necesario
  }
}
