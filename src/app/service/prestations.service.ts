import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Prestation } from '../models/taches.model';

@Injectable({
  providedIn: 'root',
})
export class PrestationsService {
  private apiUrl = environment.apiUrl; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) {}


  getServices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/prestations`);
  }

  
    // CREATE
    createPrestation(PrestationData: Omit<Prestation, '_id'>): Observable<Prestation> {
      return this.http.post<Prestation>(`${this.apiUrl}/prestations`, PrestationData);
    }
  
    // READ ONE
    getPrestationById(id: string): Observable<Prestation> {
      return this.http.get<Prestation>(`${this.apiUrl}/prestations/${id}`);
    }
  
    // UPDATE
    updatePrestation(id: string, PrestationData: Partial<Prestation>): Observable<Prestation> {
      return this.http.put<Prestation>(`${this.apiUrl}/prestations/${id}`, PrestationData);
    }
  
    // DELETE
    deletePrestation(id: string): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/prestations/${id}`);
    }
}

// return this.http.get(`${this.apiUrl}/data`);