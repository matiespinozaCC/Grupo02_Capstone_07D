import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../servicios/post.service';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service'; // Asegúrate de importar tu AuthService

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.page.html',
  styleUrls: ['./post-detail.page.scss'],
})
export class PostDetailPage implements OnInit {
  post: any; // Propiedad para almacenar el post
  loading: boolean = true; // Estado de carga
  fechaInicio: string | undefined; // Fecha de inicio de la reserva
  fechaFin: string | undefined; // Fecha de fin de la reserva
  reservaMensaje: string = ''; // Mensaje de estado de reserva

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private router: Router,
    private authService: AuthService // Inyectar AuthService
  ) {}

  async ngOnInit() {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      try {
        this.post = await this.postService.getPostById(postId);
      } catch (error) {
        console.error('Error al obtener el post:', error);
        // Aquí podrías mostrar un mensaje al usuario
      } finally {
        this.loading = false; // Cambia el estado de carga
      }
    } else {
      console.error('El postId es null o inválido');
      this.loading = false; // Cambia el estado de carga
    }
  }

  async reservar() {
    if (!this.fechaInicio || !this.fechaFin) {
      this.reservaMensaje = 'Por favor, selecciona ambas fechas.';
      return;
    }

    const usuario = await this.authService.getCurrentUser(); // Obtener usuario actual
    if (!usuario) {
      this.reservaMensaje = 'Usuario no autenticado. Por favor, inicia sesión.';
      return;
    }

    const postId = this.post.id;

    // Verificar disponibilidad
    const disponible = await this.postService.verificarDisponibilidad(postId, new Date(this.fechaInicio), new Date(this.fechaFin));

    if (disponible) {
      await this.postService.reservarPropiedad(postId, new Date(this.fechaInicio), new Date(this.fechaFin), usuario.uid);
      this.reservaMensaje = 'Reserva realizada con éxito.';
    } else {
      this.reservaMensaje = 'Las fechas seleccionadas no están disponibles.';
    }
  }

  onBack() {
    this.router.navigate(['/home']); // Ajusta la ruta según sea necesario
  }
}
