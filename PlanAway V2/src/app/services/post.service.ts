import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, getFirestore } from 'firebase/firestore';
import { app } from '../firebase-config'; // Configuración de Firebase
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private db = getFirestore(app); // Usa getFirestore() en lugar de new Firestore()

  constructor(private authService: AuthService) {}

  // Crear un post
  async createPost(title: string, description: string, category: string) {
    const user = this.authService.currentUser;
    if (user) {
      const post = {
        title,
        description,
        category, // Agrega la categoría aquí
        author: user.email,
        createdAt: new Date()
      };

      const postsCollection = collection(this.db, 'posts');
      return addDoc(postsCollection, post); // Guardar el post en Firestore
    } else {
      throw new Error('Usuario no autenticado');
    }
  }

  // Obtener todos los posts
  async getPosts() {
    const postsCollection = collection(this.db, 'posts');
    const snapshot = await getDocs(postsCollection);
    const posts = snapshot.docs.map(doc => doc.data());
    return posts;
  }
}
