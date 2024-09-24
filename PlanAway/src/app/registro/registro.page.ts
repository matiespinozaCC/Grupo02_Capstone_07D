// src/app/registro/registro.page.ts
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: 'registro.page.html',
  styleUrls: ['registro.page.scss'],
})
export class RegistroPage {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onRegister() {
    this.authService.register(this.email, this.password)
      .then(user => {
        console.log('Usuario registrado:', user);
        // Limpiar los campos
        this.email = '';
        this.password = '';
        this.router.navigate(['/login']); // Redirigir a la página de login
      })
      .catch(error => {
        console.error('Error al registrar:', error);
        this.errorMessage = 'Error al registrar: ' + error.message; // Mostrar error
      });
  }
}
