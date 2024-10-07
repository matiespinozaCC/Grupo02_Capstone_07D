import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(), provideFirebaseApp(() => initializeApp({"projectId":"planaway-440ba","appId":"1:1013793686325:web:10059ff420ec912f37427c","databaseURL":"https://planaway-440ba-default-rtdb.firebaseio.com","storageBucket":"planaway-440ba.appspot.com","apiKey":"AIzaSyBkb-EcRxHOmeaiwv32RvpbiBqhZmnz7RQ","authDomain":"planaway-440ba.firebaseapp.com","messagingSenderId":"1013793686325"})), provideAuth(() => getAuth())]
};
