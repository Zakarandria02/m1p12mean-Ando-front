import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { AdminComponent } from '../navbar/admin.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [AdminComponent, NavbarComponent, FooterComponent, RouterOutlet, CommonModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  isAuthenticated = false;
  userRole: string | null = null;

  constructor(private authService: AuthService) {
    // Écoute des changements d'authentification
    this.authService.user$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.userRole = user?.role || null;
    });
  }

}
// import { RouterModule } from '@angular/router';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-navbar',
//   imports: [RouterModule, CommonModule],
//   templateUrl: './navbar.component.html',
//   styleUrl: './navbar.component.css'
// })
// export class NavbarComponent {

//   isAuthenticated = false;
//   userRole: string | null = null;

//   constructor(private authService: AuthService) {
//     // Écoute des changements d'authentification
//     this.authService.user$.subscribe(user => {
//       this.isAuthenticated = !!user;
//       this.userRole = user?.role || null;
//     });
//   }

//   logout() {
//     this.authService.logout();
//   }

// }
