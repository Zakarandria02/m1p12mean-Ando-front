import { Component, OnInit } from '@angular/core';
// import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../service/reservation.service';

@Component({
  imports: [
    FormsModule, CommonModule // Ajoutez cette ligne
  ],
  selector: 'app-attribue-tache',
  templateUrl: './attribue-tache.component.html',
  styleUrls: ['./attribue-tache.component.css']
})
export class AttribueTacheComponent implements OnInit {
 reservations: any[] = [];
   mecaniciens: any[] = [];
   selectedMecanicien: { [key: string]: string } = {};
 
   constructor(private apiService: ReservationService) {}

   ngOnInit(): void {
     this.loadData();
   }
 
   loadData(): void {
     this.loadReservations();
     this.loadMecaniciens();
   }
 
   loadReservations(): void {
     this.apiService.getReservations().subscribe({
       next: (data: any) => this.reservations = data,
       error: (err) => console.error('Erreur:', err)
     });
   }
 
   loadMecaniciens(): void {
     this.apiService.getMecaniciens().subscribe({
       next: (data: any) => this.mecaniciens = data,
       error: (err) => console.error('Erreur:', err)
     });
   }
 
   assignMecanicien(reservationId: string): void {
     const mecanicienId = this.selectedMecanicien[reservationId];
 
     if (!mecanicienId) {
       alert("Veuillez sélectionner un mécanicien.");
       return;
     }
 
     this.apiService.assignMecanicien(reservationId, mecanicienId).subscribe({
       next: () => {
         alert("Mécanicien assigné avec succès !");
         this.loadReservations();
       },
       error: (err) => alert(err.error?.message || 'Erreur lors de l\'assignation')
     });
   }
 
}