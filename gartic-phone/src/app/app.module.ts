import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { AuthState } from './store/auth.state';
import { SharedModule } from './modules/shared/shared.module';

const appInitFn = (angularAuth: AngularFireAuth) => {
    return () => angularAuth.signInAnonymously();
};

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule,
        NgxsModule.forRoot([AuthState]),
        NgxsLoggerPluginModule.forRoot(),
        NgxsReduxDevtoolsPluginModule.forRoot(),
        BrowserAnimationsModule,
        SharedModule,
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            multi: true,
            useFactory: appInitFn,
            deps: [AngularFireAuth],
        },
    ],
    bootstrap: [AppComponent],
    exports: [],
})
export class AppModule {}
