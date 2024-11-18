import { Injectable } from '@angular/core';
import { collection, addDoc, getDocs, getDoc, getFirestore, orderBy, Timestamp } from 'firebase/firestore';
import { query, where } from 'firebase/firestore';
import { app } from '../firebase-config'; // Configuración de Firebase
import { AuthService } from './auth.service';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})

export class PostService {
  private db = getFirestore(app);
  private storage = getStorage(app);
  private readonly FAVORITES_KEY = 'favorite_posts';

  constructor(private authService: AuthService) {}

  // comentarios

  async addComment(postId: string, content: string) {
    // Obtén el usuario autenticado
    const user = await this.authService.getCurrentUser();
    if (!user) throw new Error('Usuario no autenticado');
  
   
    const userProfile = await this.authService.getUserProfile();
    const profileImageUrl = userProfile?.profileImageUrl || '/assets/default-avatar.png'; // Usa la URL de Firestore o una imagen predeterminada
  
    const comment = {
      postId: postId,
      userId: user.uid,
      userName: userProfile?.nombre || user.email, // Usa el nombre desde Firestore o el email
      profileImageUrl: profileImageUrl, // URL de la imagen de perfil desde Firestore
      content: content,
      createdAt: new Date()
    };
  
    const commentsCollection = collection(this.db, 'comentarios');
    await addDoc(commentsCollection, comment);
  }
  
  
  async updatePostCoordinates(postId: string, lat: number, lng: number) {
    const postRef = doc(this.db, 'publicaciones', postId);
    return updateDoc(postRef, { lat, lng });
  }


  // Función para obtener los comentarios de una publicación específica
  async getCommentsByPostId(postId: string) {
    const commentsCollection = collection(this.db, 'comentarios');
    const q = query(commentsCollection, where('postId', '==', postId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: (data['createdAt'] as Timestamp).toDate() // Convierte `createdAt` a un objeto `Date`
      };
    });
  }

  // Alternar el estado de favorito
  toggleFavorite(postId: string): void {
    const favorites = JSON.parse(localStorage.getItem(this.FAVORITES_KEY) || '[]');
    const index = favorites.indexOf(postId);

    if (index > -1) {
      // Si está en favoritos, lo removemos
      favorites.splice(index, 1);
    } else {
      // Si no está en favoritos, lo añadimos
      favorites.push(postId);
    }

    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
  }

  // Obtener lista de IDs de favoritos
  getFavoritePostIds(): string[] {
    return JSON.parse(localStorage.getItem(this.FAVORITES_KEY) || '[]');
  }


  // Crear un post
  async createPost(title: string, description: string, category: string, price: number, capacity: number, imageFile: File | null, address: string, lat: number, lng: number) {
    const user = this.authService.currentUser;
    if (user) {
      let imageUrl = '';
      if (imageFile) {
        const imageRef = ref(this.storage, `publicaciones/${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }
  
      const post = {
        title,
        description,
        category,
        price,
        capacity,
        imageUrl,
        author: user.email,
        createdAt: new Date(),
        aprobacion: 'pendiente',
        lat,
        lng,
        address,
      };
  
      const postsCollection = collection(this.db, 'publicaciones');
      return addDoc(postsCollection, post);
    } else {
      throw new Error('Usuario no autenticado');
    }
  }
  

  async getPosts() {
    const postsCollection = collection(this.db, 'publicaciones');
    const q = query(postsCollection, where('aprobacion', '==', 'aceptada'));
    const snapshot = await getDocs(q);

    const posts = await Promise.all(snapshot.docs.map(async (doc) => {
      const postData = doc.data();
      const authorEmail = postData['author'];

      // Aquí buscar el ID del usuario basado en el correo
      const userQuery = query(collection(this.db, 'usuarios'), where('email', '==', authorEmail));
      const userSnapshot = await getDocs(userQuery);
      const userData = userSnapshot.docs.length > 0 ? userSnapshot.docs[0].data() : null;

      const profileImageUrl = userData ? userData['profileImageUrl'] : 'https://previews.123rf.com/images/lifdiz/lifdiz1206/lifdiz120600157/13946462-3d-persona-pequeña-que-estaba-cerca-de-un-icono-que-no-imagen-en-3d-aislado-fondo-blanco.jpg';

      return {
        id: doc.id,
        ...postData,
        profileImageUrl
      };
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
      id: doc.id,
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

  async getPostById(postId: string) {
    const postRef = doc(this.db, 'publicaciones', postId);
    const snapshot = await getDoc(postRef);
  
    if (snapshot.exists()) {
      const postData = snapshot.data();
      const authorEmail = postData['author'];
  
      
      const userQuery = query(collection(this.db, 'usuarios'), where('email', '==', authorEmail));
      const userSnapshot = await getDocs(userQuery);
      const userData = userSnapshot.docs.length > 0 ? userSnapshot.docs[0].data() : null;
  
      const telefono = userData ? userData['telefono'] : 'No disponible';
      const profileImageUrl = userData ? userData['profileImageUrl'] : 'https://previews.123rf.com/images/lifdiz/lifdiz1206/lifdiz120600157/13946462-3d-persona-pequeña-que-estaba-cerca-de-un-icono-que-no-imagen-en-3d-aislado-fondo-blanco.jpg';
  
      return {
        id: snapshot.id,
        ...postData,
        telefono,
        profileImageUrl,
        address: postData['address']
      };
    } else {
      console.error(`No se encontró el post con ID: ${postId}`);
      throw new Error('Post no encontrado');
    }
  }
  
  

  
  async getPostsByUser() {
    try {
      const user = await this.authService.getCurrentUser();
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const postsCollection = collection(this.db, 'publicaciones');
      const q = query(postsCollection, where('author', '==', user.email));
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

  // Verificar disponibilidad
  async verificarDisponibilidad(postId: string, fechaInicio: Date, fechaFin: Date): Promise<boolean> {
    const reservasCollection = collection(this.db, 'reservas');
    const q = query(reservasCollection, where('postId', '==', postId), where('estado', '==', 'reservada'));

    const snapshot = await getDocs(q);
    let disponible = true;

    snapshot.docs.forEach(doc => {
      const reserva = doc.data();
      const inicioReserva = reserva['fechaInicio'].toDate();
      const finReserva = reserva['fechaFin'].toDate();

      // Comprobar si las fechas se superponen
      if ((fechaInicio >= inicioReserva && fechaInicio <= finReserva) ||
        (fechaFin >= inicioReserva && fechaFin <= finReserva) ||
        (fechaInicio <= inicioReserva && fechaFin >= finReserva)) {
        disponible = false;
      }
    });

    return disponible;
  }

  // Reservar propiedad
  async reservarPropiedad(postId: string, fechaInicio: Date, fechaFin: Date, usuarioId: string) {
    const nuevaReserva = {
      postId,
      fechaInicio,
      fechaFin,
      usuarioId,
      estado: 'reservada',
    };

    const reservasCollection = collection(this.db, 'reservas');
    return addDoc(reservasCollection, nuevaReserva);
  }

  async getReservasByPostId(postId: string): Promise<any[]> {
    const reservasCollection = collection(this.db, 'reservas');
    const q = query(reservasCollection, where('postId', '==', postId));

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

}
