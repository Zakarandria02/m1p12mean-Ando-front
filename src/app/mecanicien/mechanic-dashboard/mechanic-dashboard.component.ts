import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TachemecanoService } from '../../service/tachemecano.service';
import { AuthService } from '../../service/auth.service'; // Importez votre service d'authentification

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

  constructor(
    private router: Router, 
    private tacheService: TachemecanoService,
    private authService: AuthService // Injection conservée
  ) {}

  ngOnInit(): void {
    this.extractUserId();
    if (this.userId) {
      this.loadAppointments();
    } else {
      this.router.navigate(['/login']);
    }
  }

  private extractUserId(): void {
    try {
      // Solution 1: Lecture directe depuis localStorage
      const token = localStorage.getItem('auth_token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userId = payload.userId; // Correspond à votre structure Postman
      }
      
      // Solution alternative si userId n'est pas dans le token
      if (!this.userId) {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          this.userId = user._id;
        }
      }
    } catch (e) {
      console.error('Error extracting user ID:', e);
    }
  }

  loadAppointments(): void {
    if (!this.userId) return;
    
    // Chargement des tâches pour ce mécanicien
    this.tacheService.getTachesByUser(this.userId).subscribe({
      next: (data) => {
        console.log(data, 'datadattta');
        this.appointments = data.map(tache => ({
          id: tache._id, // L'ID de la tâche
          client: tache.user.nom,
          vehicle: `${tache.auto.marque} ${tache.auto.modele}`.trim(),
          service: tache.prestation.nom,
          time: new Date(tache.date).toLocaleTimeString(),
          status: tache.status
        }));
      },
      error: (error) => {
        console.error('Erreur:', error);
      }
    });
  }

  // Ouvrir les détails de l'intervention pour modification
  openIntervention(appointment: any): void {
    console.log('Ouverture du modal avec :', appointment);
    this.currentIntervention = { ...appointment };
  }

  closeIntervention(): void {
    this.currentIntervention = null;
  }

  // Sauvegarder le statut mis à jour dans le backend
  saveStatus(): void {
    if (!this.currentIntervention) return;

    const updatedStatus = this.currentIntervention.status;
    const appointmentId = this.currentIntervention.id;

    // Mise à jour du statut de la tâche pour cette intervention
    this.tacheService.updateTacheStatus(appointmentId, updatedStatus).subscribe(
      () => {
        console.log('Statut mis à jour avec succès');
        this.loadAppointments(); // Recharger les rendez-vous après mise à jour
        this.closeIntervention();
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du statut :', error);
      }
    );
  }

  // Filtrer les tâches par statut
  filterAppointments(status: string): void {
    if (status === 'all') {
      this.loadAppointments();
    } else {
      this.appointments = this.appointments.filter(a => a.status === status);
    }
  }
}
