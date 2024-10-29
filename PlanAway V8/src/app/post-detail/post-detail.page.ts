import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../servicios/post.service';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service'; // Asegúrate de importar tu AuthService
import { PayPalService } from '../servicios/paypal.service'; // Importa tu servicio de PayPal

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
    private authService: AuthService, // Inyectar AuthService
    private paypalService: PayPalService // Inyecta tu servicio de PayPal
  ) { }

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

    if (!disponible) {
      this.reservaMensaje = 'Las fechas seleccionadas no están disponibles.';
      return;
    }

    // Calcular el costo y el saldo a debitar
    const costo = this.post.price; // Asegúrate de que este campo existe en tu post
    const comision = costo * 0.1; // 10% de comisión
    const total = costo - comision; // Total que se sumará al saldo del usuario

    // Iniciar el proceso de pago
    const pagoExitoso = await this.paypalService.iniciarPago(total); // Implementa esta función en tu servicio de PayPal

    if (pagoExitoso) {
      await this.postService.reservarPropiedad(postId, new Date(this.fechaInicio), new Date(this.fechaFin), usuario.uid);
      await this.authService.actualizarSaldo(usuario.uid, total); // Implementa esta función para actualizar el saldo del usuario
      this.reservaMensaje = 'Reserva realizada con éxito.';
    } else {
      this.reservaMensaje = 'El pago no se pudo completar. Reserva no realizada.';
    }
  }

  onBack() {
    this.router.navigate(['/home']); // Ajusta la ruta según sea necesario
  }
}
