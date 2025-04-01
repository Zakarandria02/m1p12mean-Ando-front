import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ManagerDashboardComponent implements OnInit {
  reservations: any[] = [];
  mecaniciens: any[] = [];
  selectedMecanicien: { [key: string]: string } = {};

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadReservations();
  }

  // 🔹 Charger toutes les réservations avec détails (client, voiture, prestation, mécanicien)
  loadReservations(): void {
    this.http.get<any[]>('http://localhost:3000/api/appointments/admin').subscribe((data) => {
      this.reservations = data;
    });
  }

    // Gestion des stocks
    stockAlerts = [
      { part: 'Plaquettes frein avant', reference: 'PFA-001', stock: 2, threshold: 5 },
      { part: 'Batterie 12V', reference: 'BAT-012', stock: 0, threshold: 3 },
      { part: 'Filtre à huile', reference: 'FAH-205', stock: 4, threshold: 5 }
    ];
  
    getStockStatus(item: any): string {
      if (item.stock === 0) return 'Rupture';
      if (item.stock < item.threshold) return 'Alerte';
      return 'OK';
    }

  // 🔹 Exporter les données
  exportPDF(): void {
    console.log('Export PDF en cours...');
  }

  exportExcel(): void {
    console.log('Export Excel en cours...');
  }
}
