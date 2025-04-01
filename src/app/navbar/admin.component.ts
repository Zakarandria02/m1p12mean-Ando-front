import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-admin',
  imports: [RouterModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

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
