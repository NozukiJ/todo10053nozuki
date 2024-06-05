import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    { provide: AngularFireModule, useValue: AngularFireModule.initializeApp(environment.firebaseConfig) }
  ]
};

export const config = mergeApplicationConfig(serverConfig);
