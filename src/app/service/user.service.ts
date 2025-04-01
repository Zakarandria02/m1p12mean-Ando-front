import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl; // Adaptez selon votre URL backend

  constructor(private http: HttpClient) { }

  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    });
  }

  // CREATE
  createUser(userData: Omit<User, '_id'>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, userData, { 
      headers: this.getHeaders() 
    });
  }

  // READ ALL
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, { 
      headers: this.getHeaders() 
    });
  }

  // READ ONE
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`, { 
      headers: this.getHeaders() 
    });
  }

  // UPDATE
  updateUser(id: string, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, userData, { 
      headers: this.getHeaders() 
    });
  }

  // DELETE
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`, { 
      headers: this.getHeaders() 
    });
  }
}