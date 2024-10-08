import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate{
    constructor(private authService: AuthService, private router: Router) {}

    async canActivate(): Promise<boolean> {
        const user = await this.authService.getCurrentUser(); // Espera a que el usuario sea obtenido
        if (user){
            return true;
        } else{
            this.router.navigate(['/login']);
            return false;
        }
    }
}
