import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          const role = this.authService.userRole;
          switch (role) {
            case 'client':
              this.router.navigate(['/client-dashboard']);
              break;
            case 'mechanic':
              this.router.navigate(['/mechanic-dashboard']);
              break;
            case 'admin':
              this.router.navigate(['/manager-dashboard']);
              break;
            default:
              this.router.navigate(['/login']);
              break;
          }
        },
        error: err => {
          this.errorMessage = 'Échec de la connexion : ' + (err.error?.message || 'Erreur inconnue');
        }
      });
    }
  }
}

// ::contentReference[oaicite:12]{index=12}