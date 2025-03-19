import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = { email: '', password: '' };
  message = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.http.post('http://localhost:3000/api/auth/login', this.loginData)
      .subscribe((response: any) => {
        this.message = response.message;
        // Stocker le token dans le localStorage ou un service d'authentification
        localStorage.setItem('token', response.token);
      }, error => {
        this.message = 'Erreur de connexion';
      });
  }
}