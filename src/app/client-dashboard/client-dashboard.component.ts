import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../service/reservation.service';
import { PortfeuilleService } from '../service/portfeuille.service';

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
  appointments: any[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  userId: string | null = null;
  solde: number = 0;
  montant: number = 0;
  currentInvoice: any = null;
  currentIntervention: any = null;
  printMode: boolean = false;

  get today(): string {
    return new Date().toLocaleDateString();
  }

  // get invoiceDate(): string {
  //   return new Date(this.appointments.date).toLocaleDateString();
  // }

  constructor(
    private router: Router, 
    private reservationService: ReservationService,
    private portefeuilleService: PortfeuilleService
  ) {}

  ngOnInit(): void {
    this.initializeDashboard();
    this.chargerPortefeuille();
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
      next: (data: any[]) => {
        console.log('Données brutes reçues:', data);
        this.appointments = data; // Stocke directement les données API
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.errorMessage = 'Impossible de charger vos rendez-vous';
        this.isLoading = false;
      }
    });
  }
  

  openIntervention(appointment: any): void {
    console.log('Ouverture du modal avec :', appointment);
    this.currentIntervention = appointment;
  }


  closeModal() {
    this.currentIntervention = null;
  }


  markAsPaid(): void {
    console.log("markAsPaid() appelée !");
    // Ajoute ici la logique pour marquer une facture comme payée
  }

  printInvoice(): void {
    console.log("printInvoice() appelée !");
    window.print(); // Ouvre la boîte de dialogue d'impression
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

  chargerPortefeuille(): void {
    this.isLoading = true;
    this.portefeuilleService.getMonPortefeuille().subscribe({
      next: (data: any) => {
        this.solde = data.money;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement du portefeuille';
        this.isLoading = false;
      }
    });
  }

  ajouterArgent(): void {
    if (this.montant <= 0) {
      this.errorMessage = 'Le montant doit être positif';
      return;
    }

    this.isLoading = true;
    this.portefeuilleService.ajouterArgent(this.montant).subscribe({
      next: () => {
        this.solde += this.montant;
        this.montant = 0;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de l\'ajout d\'argent';
        this.isLoading = false;
      }
    });
  }

  retirerArgent(): void {
    if (this.montant <= 0) {
      this.errorMessage = 'Le montant doit être positif';
      return;
    }

    if (this.montant > this.solde) {
      this.errorMessage = 'Solde insuffisant';
      return;
    }

    this.isLoading = true;
    this.portefeuilleService.retirerArgent(this.montant).subscribe({
      next: () => {
        this.solde -= this.montant;
        this.montant = 0;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du retrait d\'argent';
        this.isLoading = false;
      }
    });
  }
}