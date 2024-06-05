import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    ServerModule,
    AppModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}

export default AppServerModule;
