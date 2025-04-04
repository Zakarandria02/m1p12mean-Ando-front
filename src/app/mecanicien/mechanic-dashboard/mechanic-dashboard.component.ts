import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TachemecanoService } from '../../service/tachemecano.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-mechanic-dashboard',
  templateUrl: './mechanic-dashboard.component.html',
  styleUrls: ['./mechanic-dashboard.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class MechanicDashboardComponent implements OnInit {
  today: Date = new Date();
  appointments: any[] = [];
  currentIntervention: any = null;
  userId: string | null = null;
  pieces: any[] = [];
  response: any;
  errorMessage: string | null = null;

  modalState = {
    isOpen: false,
    appointmentId: null as string | null,
    selectedPieces: [] as string[]
  };

  constructor(
    private router: Router,
    private tacheService: TachemecanoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeData();
  }

  private initializeData(): void {
    this.extractUserId();
    if (this.userId) {
      this.loadAppointments();
      this.loadPieces();
    } else {
      this.router.navigate(['/login']);
    }
  }

  private extractUserId(): void {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userId = payload.userId;
      }

      if (!this.userId) {
        const userData = localStorage.getItem('user');
        if (userData) {
          this.userId = JSON.parse(userData)._id;
        }
      }
    } catch (e) {
      console.error('Erreur lors de l\'extraction de l\'ID utilisateur:', e);
    }
  }

  private loadAppointments(): void {
    if (!this.userId) return;
    
    this.tacheService.getTachesByUser(this.userId).subscribe({
      next: (data) => this.appointments = data,
      error: (error) => console.error('Erreur lors du chargement des rendez-vous:', error)
    });
  }

  private loadPieces(): void {
    this.tacheService.getAllPieces().subscribe({
      next: (pieces) => this.pieces = pieces,
      error: (error) => console.error('Erreur lors du chargement des pièces:', error)
    });
  }

  openModal(appointmentId: string): void {
    this.modalState = { isOpen: true, appointmentId, selectedPieces: [] };
  }

  closeModal(): void {
    this.modalState = { isOpen: false, appointmentId: null, selectedPieces: [] };
    this.response = null;
    this.errorMessage = null;
  }

  toggleSelection(pieceId: string): void {
    const { selectedPieces } = this.modalState;
    this.modalState.selectedPieces = selectedPieces.includes(pieceId)
      ? selectedPieces.filter(id => id !== pieceId)
      : [...selectedPieces, pieceId];
  }

  sendRequest(): void {
    const { appointmentId, selectedPieces } = this.modalState;
    if (!appointmentId || selectedPieces.length === 0) {
      this.errorMessage = "Veuillez sélectionner au moins une pièce.";
      return;
    }

    this.tacheService.updateReservationPiece(appointmentId, selectedPieces).subscribe({
      next: (response) => {
        this.response = response;
        this.errorMessage = null;
      },
      error: (error) => {
        this.errorMessage = "Erreur lors de l'envoi de la requête.";
        console.error('Erreur:', error);
      }
    });
  }

  saveStatus(): void {
    if (!this.currentIntervention) return;
    console.log("id", this.currentIntervention._id)

    this.tacheService.updateTacheStatus(this.currentIntervention._id, this.currentIntervention.status).subscribe({
      next: () => {
        console.log('Statut mis à jour avec succès' ,  this.currentIntervention.status );
        this.loadAppointments();
        this.closeIntervention();
      },
      error: (error) => console.error('Erreur lors de la mise à jour du statut :', error)
    });
  }

  openIntervention(appointment: any): void {
    this.currentIntervention = { ...appointment };
  }

  closeIntervention(): void {
    this.currentIntervention = null;
  }

  filterAppointments(status: string): void {
    if (status === 'all') {
      this.loadAppointments();
    } else {
      this.appointments = this.appointments.filter(a => a.status === status);
    }
  }
}
