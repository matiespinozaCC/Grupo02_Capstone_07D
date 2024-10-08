import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  email: string = '';
  contrasena: string = '';
  errorMensaje: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onLogin() {
    this.authService.login(this.email, this.contrasena)
      .then(user => {
        console.log('Usuario:', user);
        this.email = '';
        this.contrasena = '';
        this.router.navigate(['/home']);
      })
      .catch(error => {
        console.error('Error al iniciar sesión:', error)
        this.contrasena = '';
        this.errorMensaje = 'Correo o contraseña incorrectos';
      });
  }
}
