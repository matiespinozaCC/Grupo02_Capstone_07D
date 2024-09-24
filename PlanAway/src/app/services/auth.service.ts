// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';
import { app } from '../firebase-config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = getAuth(app);
  currentUser: User | null = null;

  constructor() {
    // Observar el estado de autenticación
    onAuthStateChanged(this.auth, user => {
      this.currentUser = user; // Actualizar el usuario actual
    });
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(userCredential => {
        this.currentUser = userCredential.user; // Guardar usuario
        return this.currentUser;
      })
      .catch(error => {
        console.error('Error al iniciar sesión:', error);
        throw error;
      });
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(userCredential => {
        this.currentUser = userCredential.user; // Guardar usuario
        return this.currentUser;
      })
      .catch(error => {
        console.error('Error al registrar:', error);
        throw error;
      });
  }

  // Método para cerrar sesión
  logout() {
    return this.auth.signOut().then(() => {
      this.currentUser = null; // Limpiar el usuario actual
    });
  }
}
