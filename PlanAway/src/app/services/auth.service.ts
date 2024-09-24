// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
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

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(userCredential => userCredential.user)
      .catch(error => {
        console.error('Error al registrar:', error);
        throw error;
      });
  }
}
