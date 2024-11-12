import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { Firestore, doc, getDoc, getFirestore } from 'firebase/firestore';
import { app } from '../firebase-config'; // Asegúrate de importar tu configuración de Firebase

@Injectable({
    providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
    private firestore: Firestore;

    constructor(private authService: AuthService, private router: Router) {
        this.firestore = getFirestore(app); // Inicializa Firestore
    }

    async canActivate(): Promise<boolean> {
        const user = await this.authService.getCurrentUser(); // Espera a que el usuario sea obtenido

        if (user) {
            // Verifica el rol de administrador en Firestore
            const userDoc = await getDoc(doc(this.firestore, 'usuarios', user.uid));
            if (userDoc.exists() && userDoc.data()?.['administrador'] === true) {
                return true; // El usuario es administrador
            } else {
                this.router.navigate(['/home']); // Redirigir si no es admin
                return false; // No tiene acceso
            }
        } else {
            this.router.navigate(['/login']); // Redirigir si no está autenticado
            return false; // No tiene acceso
        }
    }
}