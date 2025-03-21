// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/home/home.component';
import { LoginComponent } from './app/login/login.component';
import { ReservationComponent } from './app/reservation/reservation.component';
import { ContactComponent } from './app/contact/contact.component';
import { ServicesComponent } from './app/services/services.component';
// import { AboutComponent } from './app/about.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reservation', component: ReservationComponent }, 
  { path: 'services', component: ServicesComponent },
  { path: 'contact', component: ContactComponent },
  // Ajoutez d'autres routes ici
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});
