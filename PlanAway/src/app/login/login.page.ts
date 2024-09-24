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

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.email, this.password)
      .then(user => {
        console.log('Usuario:', user);
        // Redirige o maneja el inicio de sesión exitoso
        this.router.navigate(['/tabs/tab1']); // Cambia '/home' a la ruta que necesites
      })
      .catch(error => {
        console.error('Error al iniciar sesión:', error);
      });
  }
}
