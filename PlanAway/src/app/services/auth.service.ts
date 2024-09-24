// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase-config'; // Ajusta la ruta según tu estructura

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = getAuth(app);

  constructor() {}

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(userCredential => {
        // Usuario iniciado sesión
        return userCredential.user;
      })
      .catch(error => {
        // Maneja errores aquí
        console.error('Error al iniciar sesión:', error);
        throw error;
      });
  }
}
