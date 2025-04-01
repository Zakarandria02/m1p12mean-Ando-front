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
    updateTacheStatus(appointmentId: string, status: string): Observable<any> {
      return this.http.put(`${this.apiUrl}/appointments/tasks/${appointmentId}/status`, { status });
    }
}
