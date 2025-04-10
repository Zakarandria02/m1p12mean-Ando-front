import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  isAuthenticated = false;
  userRole: string | null = null;

  constructor(private authService: AuthService) {
    // Écoute des changements d'authentification
    this.authService.user$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.userRole = user?.role || null;
    });
  }

  logout() {
    this.authService.logout();
  }

}
