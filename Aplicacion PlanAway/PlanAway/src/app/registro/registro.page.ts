import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {

  email: string = '';
  contrasena: string = '';
  errorMensaje: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  
  onRegister(){
    this.authService.register(this.email, this.contrasena)
      .then(user => {
        console.log('Usuario registrado: ', user)
        //limpiar los campos
        this.email = '';
        this.contrasena = '';
        this.router.navigate(['/login']);
      })
      .catch(error => {
        console.error('Error al registrar: ', error);
        this.errorMensaje = 'Error al registrar: ' + error.message
      })
  }

}
