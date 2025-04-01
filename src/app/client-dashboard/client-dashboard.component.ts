import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../service/reservation.service';

// Interface pour le typage fort
interface Appointment {
  _id: string;
  auto: {
    marque: string;
    modele: string;
    immatriculation?: string;
  };
  prestation: {
    nom: string;
    description?: string;
    prix?: number;
  };
  date: string;
  status: 'En Attente' | 'Attribué' | 'En Cours' | 'Terminé';
}

interface FormattedAppointment {
  id: string;
  vehicle: {
    marque: string;
    modele: string;
    immatriculation?: string;
    displayText: string;
  };
  service: string;
  date: Date;
  formattedDate: string;
  formattedTime: string;
  statusClass: string;
  statusText: string;
  status: string;
}

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css']
})
export class ClientDashboardComponent implements OnInit {
  appointments: FormattedAppointment[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  userId: string | null = null;

  constructor(
    private router: Router, 
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.initializeDashboard();
  }

  private initializeDashboard(): void {
    this.userId = this.getUserIdFromToken();
    
    if (!this.userId) {
      this.errorMessage = 'Vous devez être connecté pour voir vos rendez-vous';
      this.router.navigate(['/login']);
      return;
    }

    this.loadAppointments();
  }

  private getUserIdFromToken(): string | null {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return null;
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || null;
    } catch (e) {
      console.error('Erreur lors de la récupération du userId:', e);
      return null;
    }
  }

  loadAppointments(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.reservationService.getClientReservations(this.userId!).subscribe({
      next: (data: Appointment[]) => {
        console.log('tesss', data)
        this.appointments = this.formatAppointments(data);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.errorMessage = 'Impossible de charger vos rendez-vous';
        this.isLoading = false;
      }
    });
  }

  private formatAppointments(appointments: Appointment[]): FormattedAppointment[] {
    return appointments.map(appointment => {
      const dateObj = new Date(appointment.date);
      
      return {
        id: appointment._id,
        vehicle: {
          marque: appointment.auto.marque,
          modele: appointment.auto.modele,
          immatriculation: appointment.auto.immatriculation,
          displayText: `${appointment.auto.marque} ${appointment.auto.modele}`.trim()
        },
        service: appointment.prestation.nom,
        date: dateObj,
        formattedDate: dateObj.toLocaleDateString('fr-FR'),
        formattedTime: dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        ...this.getStatusDetails(appointment.status)
      };
    });
  }

  private getStatusDetails(status: string): { statusClass: string; statusText: string; status: string } {
    const statusMap = {
      'En Attente': {
        class: 'bg-yellow-100 text-yellow-800',
        text: 'Payer pour commencer le travail'
      },
      'Attribué': {
        class: 'bg-blue-100 text-blue-800',
        text: 'Un mécanicien prend en charge votre voiture'
      },
      'En Cours': {
        class: 'bg-orange-100 text-orange-800',
        text: 'Le véhicule est en réparation'
      },
      'Terminé': {
        class: 'bg-green-100 text-green-800',
        text: 'Le véhicule est prêt à récupérer'
      },
      default: {
        class: 'bg-gray-100 text-gray-800',
        text: 'Statut inconnu'
      }
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.default;
    
    return {
      statusClass: statusInfo.class,
      statusText: statusInfo.text,
      status
    };
  }
}