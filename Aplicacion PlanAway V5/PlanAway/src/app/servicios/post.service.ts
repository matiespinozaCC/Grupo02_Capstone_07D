import { Injectable } from '@angular/core';
import { collection, addDoc, getDocs, getDoc, getFirestore } from 'firebase/firestore';
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

    // Mapeo de documentos para incluir el ID
    const posts = snapshot.docs.map(doc => ({
      id: doc.id, // Guardar el ID del documento
      ...doc.data() // Obtener los datos del documento
    }));

    return posts;
  }

  // Obtener los posts pendientes de aprobación
  async getPendingPosts() {
    const postsCollection = collection(this.db, 'publicaciones');
    // Filtrar solo los posts con aprobación 'pendiente'
    const q = query(postsCollection, where('aprobacion', '==', 'pendiente'));
    const snapshot = await getDocs(q);

    // Mapeo de documentos para incluir el ID
    const posts = snapshot.docs.map(doc => ({
      id: doc.id, // Guardar el ID del documento
      ...doc.data() // Obtener los datos del documento
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

  async getPostById(postId: string) {
    const postRef = doc(this.db, 'publicaciones', postId);
    const snapshot = await getDoc(postRef);

    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    } else {
      console.error(`No se encontró el post con ID: ${postId}`); // Agrega este log para más contexto
      throw new Error('Post no encontrado');
    }
  }

  // Obtener posts por usuario autenticado
  async getPostsByUser() {
    try {
      const user = await this.authService.getCurrentUser(); // Espera a que el usuario esté autenticado
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const postsCollection = collection(this.db, 'publicaciones');
      const q = query(postsCollection, where('author', '==', user.email)); // Filtrar por el email del usuario
      const snapshot = await getDocs(q);

      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return posts;
    } catch (error) {
      console.error('Error al obtener publicaciones:', error);
      throw error;
    }
  }

  async updatePost(postId: string, updatedData: any) {
    const postRef = doc(this.db, 'publicaciones', postId);
    return updateDoc(postRef, updatedData);
  }

}

