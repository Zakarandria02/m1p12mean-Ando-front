// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/home/home.component';
import { LoginComponent } from './app/login/login.component';
import { ReservationComponent } from './app/reservation/reservation.component';
import { ContactComponent } from './app/contact/contact.component';
import { ServicesComponent } from './app/services/services.component';
import { ClientDashboardComponent } from './app/client-dashboard/client-dashboard.component';
import { MechanicDashboardComponent } from './app/mecanicien/mechanic-dashboard/mechanic-dashboard.component';
import {InterventionSheetComponent} from './app/mecanicien/intervantion/intervention-sheet.component';
import { ManagerDashboardComponent } from './app/admin/manager-dashboard/manager-dashboard.component';
import { UserManagementComponent } from './app/admin/user-management/user-management.component';
import { AttribueTacheComponent } from './app/admin/attribue-tache/attribue-tache.component';
import { PieceManagementComponent } from './app/admin/piece-management/piece-management.component';
import { RoleGuard } from './app/guards/role.guard';
// import { AboutComponent } from './app/about.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reservation', component: ReservationComponent }, 
  { path: 'services', component: ServicesComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'client-dashboard', component: ClientDashboardComponent, canActivate: [RoleGuard], data: { roles: ['client'] } },
  { path: 'mechanic-dashboard', component: MechanicDashboardComponent, canActivate: [RoleGuard], data: { roles: ['mechanic'] } },
  { path: 'mechanic-intervention', component: InterventionSheetComponent, canActivate: [RoleGuard], data: { roles: ['mechanic'] } },
  { path: 'manager-dashboard', component: ManagerDashboardComponent, canActivate: [RoleGuard], data: { roles: ['admin'] } },
  { path: 'user-management', component: UserManagementComponent, canActivate: [RoleGuard], data: { roles: ['admin'] } },
  { path: 'mechanic-tache', component: AttribueTacheComponent, canActivate: [RoleGuard], data: { roles: ['admin'] } },
  { path: 'piece-management', component: PieceManagementComponent, canActivate: [RoleGuard], data: { roles: ['admin'] } },


  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // { path: 'access-denied', component: AccessDeniedComponent }
  // Ajoutez d'autres routes ici  /
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes),
    provideHttpClient(),
  ]
});
