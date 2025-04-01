import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}
  
    // Récupérer les tâches assignées au mécanicien
    getClientReservations(userId: string): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/appointments/${userId}/client`);
    }

    createAppointment(formData: any) {
      return this.http.post(`${this.apiUrl}/appointments`, formData);
    }

      // 🔹 Récupérer toutes les réservations (admin)
    getReservations() {
      return this.http.get(`${this.apiUrl}/appointments/admin`);
    }

    // 🔹 Récupérer tous les mécaniciens
    getMecaniciens() {
      return this.http.get(`${this.apiUrl}/appointments/mecaniciens`);
    }

    // 🔹 Assigner un mécanicien
    assignMecanicien(reservationId: string, mecanicienId: string) {
      return this.http.put(
        `${this.apiUrl}/appointments/${reservationId}/assign`, 
        { mecanicienId }
      );
    }
  
}
