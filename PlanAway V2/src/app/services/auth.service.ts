import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, browserLocalPersistence, setPersistence, User } from 'firebase/auth';
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
      this.currentUser = user; // Actualizar el usuario actual si está logueado
    });
  }

  // Nuevo método para obtener el usuario actual
  getCurrentUser(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(this.auth, user => {
        if (user) {
          resolve(user);
        } else {
          resolve(null);
        }
      }, reject);
    });
  }

  async login(email: string, password: string) {
    try {
      // Configura la persistencia de la sesión
      await setPersistence(this.auth, browserLocalPersistence); // Mantiene la sesión incluso al recargar la página
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.currentUser = userCredential.user;
      return this.currentUser;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(userCredential => {
        this.currentUser = userCredential.user;
        return this.currentUser;
      })
      .catch(error => {
        console.error('Error al registrar:', error);
        throw error;
      });
  }

  logout() {
    return this.auth.signOut().then(() => {
      this.currentUser = null; // Limpiar el usuario actual al cerrar sesión
    });
  }
}
