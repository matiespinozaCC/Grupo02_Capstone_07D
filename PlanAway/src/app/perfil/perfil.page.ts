// src/app/perfil/perfil.page.ts
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: 'perfil.page.html',
  styleUrls: ['perfil.page.scss'],
})
export class PerfilPage {
  user: any;

  constructor(private authService: AuthService) {
    this.user = this.authService.currentUser; // Obtener el usuario actual
  }
}
