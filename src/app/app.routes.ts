import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ReservationComponent } from './reservation/reservation.component';
import { ContactComponent } from './contact/contact.component';
import { ServicesComponent } from './services/services.component';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';
import { MechanicDashboardComponent } from './mecanicien/mechanic-dashboard/mechanic-dashboard.component';
import { InterventionSheetComponent } from './mecanicien/intervantion/intervention-sheet.component';
import { ManagerDashboardComponent } from './admin/manager-dashboard/manager-dashboard.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { AttribueTacheComponent } from './admin/attribue-tache/attribue-tache.component';
import { PieceManagementComponent } from './admin/piece-management/piece-management.component';
import { RoleGuard } from './guards/role.guard';


export const routes: Routes = [
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

  // Ajoutez d'autres routes ici
  { path: '**', redirectTo: '' } // Redirige vers la page d'accueil pour les routes non trouvées
];