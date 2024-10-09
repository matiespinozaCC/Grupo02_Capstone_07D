import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, browserLocalPersistence, setPersistence, User } from 'firebase/auth';
import { app } from '../firebase-config';
import { Firestore, getFirestore, doc, setDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = getAuth(app)
  private firestore: Firestore; // Declara Firestore
  currentUser: User | null = null;

  constructor() {
    this. firestore = getFirestore(app); // Inicializa Firestore
    //Observar el estado de autenticación
    onAuthStateChanged(this.auth, user =>{
      this.currentUser = user;
    });
   }

   getCurrentUser(): Promise<User | null> {
    return new Promise((resolve, reject) =>{
      onAuthStateChanged(this.auth, user =>{
        if (user){
          resolve(user);
        }else{
          resolve(null);
        }
      }, reject);
    });
   }

   async login(email: string, contrasena: string){
    try{
      //Configura la persistencia de la sesión
      await setPersistence(this.auth, browserLocalPersistence); // Mantiene la sesión incluso al recargar la página
      const userCredential = await signInWithEmailAndPassword(this.auth, email, contrasena);
      this.currentUser = userCredential.user;
      return this.currentUser;
    } catch(error){
      console.error('Error al iniciar sesion:', error);
      throw error;
    }
   }

   async register(email: string, contrasena: string){
    try{
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, contrasena);
      this.currentUser = userCredential.user;
      const userId = this.currentUser.uid;

      //guarda el usuario en firestore
      await setDoc(doc(this.firestore, 'usuarios', userId),{
        administrador: false,
        email: email //puedes agregar otros campos si se dea
      });

      return this.currentUser;
    }catch (error) {
      console.error('Error al registrar: ', error);
      throw error;
    }
   }

   logout(){
    return this.auth.signOut().then(() => {
      this.currentUser = null;// Limpiar el usuario actual al cerrar sesión
    });
   }

}
