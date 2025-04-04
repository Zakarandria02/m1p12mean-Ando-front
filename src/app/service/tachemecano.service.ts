import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TachemecanoService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}
  
    // Récupérer les tâches assignées au mécanicien
    getTachesByUser(userId: string): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/appointments/${userId}/taches`);
    }
  
    // Mettre à jour le statut de la tâche
    updateTacheStatus(appointmentId: string, statut: string): Observable<any> {
      console.log("status", statut);
      console.log("id", appointmentId);
      return this.http.put(`${this.apiUrl}/appointments/${appointmentId}/status`, { statut });
    }

    getAllPieces(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/pieces`); // Récupère toutes les pièces
    }

    updateReservationPiece(appointmentId: string, pieceIds: string[]): Observable<any> {
      const url = `${this.apiUrl}/appointments/${appointmentId}/piece`;
      return this.http.put(url, { piece: pieceIds });
    }
}
