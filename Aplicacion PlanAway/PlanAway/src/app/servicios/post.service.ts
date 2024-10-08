import { Injectable } from '@angular/core';
import { collection, addDoc, getDocs, getFirestore } from 'firebase/firestore';
import { query, where } from 'firebase/firestore';
import { app } from '../firebase-config'; // Configuración de Firebase
import { AuthService } from './auth.service';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})

export class PostService {
  private db = getFirestore(app); // Usa getFirestore() en lugar de new Firestore()

  constructor(private authService: AuthService) { }

  // Crear un post
  async createPost(title: string, description: string, category: string) {
    const user = this.authService.currentUser;
    if (user) {
      const post = {
        title,
        description,
        category, // Agrega la categoría aquí
        author: user.email,
        createdAt: new Date(),
        aprobacion: 'pendiente'
      };

      const postsCollection = collection(this.db, 'publicaciones');
      return addDoc(postsCollection, post); // Guardar el post en Firestore
    } else {
      throw new Error('Usuario no autenticado');
    }
  }

  // Obtener solo los posts aprobados
  async getPosts() {
    const postsCollection = collection(this.db, 'publicaciones');
    // Filtrar solo los posts con aprobación 'aceptada'
    const q = query(postsCollection, where('aprobacion', '==', 'aceptada'));
    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map(doc => doc.data());
    return posts;
  }

  // Obtener los posts pendientes de aprobación
  async getPendingPosts() {
    const postsCollection = collection(this.db, 'publicaciones');
    // Filtrar solo los posts con aprobación 'pendiente'
    const q = query(postsCollection, where('aprobacion', '==', 'pendiente'));
    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map(doc => ({
      id: doc.id, // Guardar el ID del documento para poder aceptar/eliminar
      ...doc.data()
    }));
    return posts;
  }

  // Aceptar un post
  async approvePost(postId: string) {
    const postRef = doc(this.db, 'publicaciones', postId);
    return updateDoc(postRef, { aprobacion: 'aceptada' });
  }

  // Eliminar un post
  async deletePost(postId: string) {
    const postRef = doc(this.db, 'publicaciones', postId);
    return deleteDoc(postRef);
  }

}

