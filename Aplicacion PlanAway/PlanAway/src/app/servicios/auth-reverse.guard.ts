import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthReverseGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const user = await this.authService.getCurrentUser();
    if (user) {
        console.log("Ya estas logueado")
        this.router.navigate(['/']); // Redirigir a la página principal si ya está autenticado
      return false; // No permitir el acceso al login o registro
    } else {
      return true; // Permitir el acceso si no está autenticado
    }
  }
}
