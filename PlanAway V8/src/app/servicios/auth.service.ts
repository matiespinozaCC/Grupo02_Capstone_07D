import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, browserLocalPersistence, setPersistence, User } from 'firebase/auth';
import { Firestore, getFirestore, doc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase-config'; // Importa tu instancia de Firebase

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = getAuth(app);
  private firestore: Firestore; // Declara Firestore
  private storage = getStorage(app); // Inicializa Firebase Storage
  currentUser: User | null = null;

  constructor() {
    this.firestore = getFirestore(app); // Inicializa Firestore
    // Observar el estado de autenticación
    onAuthStateChanged(this.auth, user => {
      this.currentUser = user;
    });
  }

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

  async login(email: string, contrasena: string) {
    try {
      // Configura la persistencia de la sesión
      await setPersistence(this.auth, browserLocalPersistence); // Mantiene la sesión incluso al recargar la página
      const userCredential = await signInWithEmailAndPassword(this.auth, email, contrasena);
      this.currentUser = userCredential.user;
      return this.currentUser;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  async register(email: string, contrasena: string, nombre: string, telefono: string, genero: string, fechaNacimiento: string, profileImage: File | null) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, contrasena);
      this.currentUser = userCredential.user;
      const userId = this.currentUser.uid;
      let profileImageUrl = '';

      // Si el usuario ha seleccionado una imagen, súbela a Storage
      if (profileImage) {
        const imageRef = ref(this.storage, `profileImages/${userId}`);
        await uploadBytes(imageRef, profileImage);
        profileImageUrl = await getDownloadURL(imageRef);
      }

      // Guarda el usuario en Firestore
      await setDoc(doc(this.firestore, 'usuarios', userId), {
        administrador: false,
        email: email,
        nombre: nombre,
        telefono: telefono,
        genero: genero,
        fechaNacimiento: fechaNacimiento,
        saldo: 0, // Establecer saldo en 0
        profileImageUrl: profileImageUrl // URL de la imagen de perfil
      });

      return this.currentUser;
    } catch (error) {
      console.error('Error al registrar: ', error);
      throw error;
    }
  }

  async actualizarSaldo(usuarioId: string, saldo: number) {
    const userRef = doc(this.firestore, 'usuarios', usuarioId); // Cambia this.db a this.firestore
    await updateDoc(userRef, {
      saldo: increment(saldo) // Usa el método increment para añadir el saldo
    });
  }

  logout() {
    return this.auth.signOut().then(() => {
      this.currentUser = null; // Limpiar el usuario actual al cerrar sesión
    });
  }
}
