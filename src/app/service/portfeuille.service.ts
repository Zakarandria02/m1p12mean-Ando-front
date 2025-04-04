import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PortfeuilleService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    private extractUserId(): string {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          throw new Error('Aucun token d\'authentification trouvé');
        }
    
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (!payload.userId) {
            throw new Error('ID utilisateur non présent dans le token');
          }
          return payload.userId;
        } catch (e) {
          console.error('Erreur décodage token:', e);
          throw new Error('Token invalide');
        }
      }
  
    getMonPortefeuille(): Observable<any> {
    const userId = this.extractUserId();
    return this.http.get(`${this.apiUrl}/money/${userId}/user`);
  }

  ajouterArgent(montant: number): Observable<any> {
    const userId = this.extractUserId();
    return this.http.patch(`${this.apiUrl}/money`, { userId, montant });
  }

  retirerArgent(montant: number): Observable<any> {
    const userId = this.extractUserId();
    return this.http.patch(`${this.apiUrl}/retirer`, { userId, montant });
  }
  
}
