// src/app/login/login.page.ts
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router'; // Importar Router

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  email: string = '';  // Inicializar con una cadena vacía
  password: string = ''; // Inicializar con una cadena vacía
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onLogin() {
    this.authService.login(this.email, this.password)
      .then(user => {
        console.log('Usuario:', user);
        // Redirige o maneja el inicio de sesión exitoso
        // Limpiar los campos
        this.email = '';
        this.password = '';
        this.router.navigate(['/perfil']); // Cambia '/home' a la ruta que necesites
      })
      .catch(error => {
        console.error('Error al iniciar sesión:', error);
        this.password = '';
        this.errorMessage = 'Correo o contraseña incorrectos'; // Mostrar mensaje de error
      });
  }
}
