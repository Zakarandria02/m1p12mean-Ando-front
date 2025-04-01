import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PrestationsService {
  private apiUrl = environment.apiUrl; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) {}

  getServices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/prestations`);
  }
}

// return this.http.get(`${this.apiUrl}/data`);