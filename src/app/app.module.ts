import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { getApp, provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { connectFirestoreEmulator, Firestore, getFirestore, initializeFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from './../environments/environment';
import { USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/compat/auth';
import { USE_EMULATOR as USE_FIRESTORE_EMULATOR } from '@angular/fire/compat/firestore';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => {
      let auth = getAuth()
      if (!environment.production) {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: false })
      }
      return auth
    }),
    provideFirestore(() => {
      let firestore: Firestore
      if (!environment.production) {
        console.log('================FIRESTORE EMULATOR============');
        // long polling for Cypress
        firestore = initializeFirestore(getApp(), {
          experimentalForceLongPolling: true,
        })
        connectFirestoreEmulator(firestore, 'localhost', 8080)
      } else {
        console.log('================FIRESTORE CLOUD============');
        firestore = getFirestore()
      }
      return firestore
    })
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})


export class AppModule {}
