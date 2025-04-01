import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'auth_token';
  private roleKey = 'user_role';
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    if (typeof window !== 'undefined') { // Vérifie si `window` existe
      const token = localStorage.getItem(this.tokenKey);
      const role = localStorage.getItem(this.roleKey);
      if (token && role) {
        this.userSubject.next({ token, role });
      }
    }
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        if (response.token && response.user && response.user.role) {
          this.storeUserData(response.token, response.user.role);
          this.userSubject.next({ token: response.token, role: response.user.role });
        }
      })
    );
  }

  logout(): void {
    if (typeof window !== 'undefined') { // Vérifie si `window` existe
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.roleKey);
    }
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  private storeUserData(token: string, role: string): void {
    if (typeof window !== 'undefined') { // Vérifie si `window` existe
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.roleKey, role);
    }
  }

  get isAuthenticated(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem(this.tokenKey);
  }

  get userRole(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem(this.roleKey) : null;
  }
}
