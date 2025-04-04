import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacturationService } from '../../service/facturation.service';
import { PrestationsService } from '../../service/prestations.service';
import { Prestation } from '../../models/taches.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css'],
  standalone: true,
   imports: [CommonModule, FormsModule]
})
export class ManagerDashboardComponent implements OnInit {
  reservations: any[] = [];
  prestations: Prestation[] = [];  // Changé de 'prestation' à 'prestations' pour plus de clarté
  currentPrestation: Prestation | null = null;
  isEditMode = false;
  newPrestation: Partial<Prestation> = {  // Ajout de l'objet manquant newPrestation
    nom: '',
    description: '',
    prix: 0  
  };

  constructor(
    private apiService: FacturationService,
    private apiPrestation: PrestationsService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loadFacture();
    this.loadPrestations();  // Renommé pour correspondre au nom de la variable
  }

  loadFacture(): void {
    this.apiService.getAllInvoices().subscribe({
      next: (data: any) => this.reservations = data,
      error: (err) => console.error('Erreur:', err)
    });
  }

  loadPrestations(): void {  // Renommé pour correspondre au nom de la variable
    this.apiPrestation.getServices().subscribe({
      next: (data: any) => this.prestations = data,
      error: (err) => console.error('Erreur:', err)
    });
  }

  createPrestation(): void {
    this.apiPrestation.createPrestation(this.newPrestation as Prestation).subscribe({  // Utilisation de newPrestation
      next: (prestation) => {
        this.prestations.push(prestation);
        this.resetForm();
      },
      error: (err) => console.error('Erreur lors de la création', err)
    });
  }

  editPrestation(prestation: Prestation): void {
    this.currentPrestation = { ...prestation };
    this.isEditMode = true;
  }

  updatePrestation(): void {  // Correction du nom de la méthode (typo)
    if (!this.currentPrestation) return;
    
    const { _id, ...updateData } = this.currentPrestation;
    this.apiPrestation.updatePrestation(_id, updateData).subscribe({
      next: (updatedPrestation) => {
        const index = this.prestations.findIndex(p => p._id === updatedPrestation._id);
        if (index !== -1) this.prestations[index] = updatedPrestation;
        this.cancelEdit();
      },
      error: (err) => console.error('Erreur lors de la mise à jour', err)
    });
  }

  deletePrestation(id: string): void {  // Correction du nom de la méthode (typo)
    if (confirm('Êtes-vous sûr de vouloir supprimer cette prestation ?')) {  // Message corrigé
      this.apiPrestation.deletePrestation(id).subscribe({
        next: () => this.prestations = this.prestations.filter(p => p._id !== id),
        error: (err) => console.error('Erreur lors de la suppression', err)
      });
    }
  }

  resetForm(): void {
    this.newPrestation = {
      nom: '',
      description: '',
      prix: 0
    };
  }

  cancelEdit(): void {
    this.currentPrestation = null;
    this.isEditMode = false;
  }

  updateModel(field: string, value: any): void {
    if (this.isEditMode && this.currentPrestation) {
      (this.currentPrestation as any)[field] = value;
    } else {
      (this.newPrestation as any)[field] = value;  // Correction de 'newprestation' à 'newPrestation'
    }
  }

  getFieldValue(field: string): any {
    if (this.isEditMode && this.currentPrestation) {
      return (this.currentPrestation as any)[field];
    } else {
      return (this.newPrestation as any)[field];
    }
  }
  
  setFieldValue(field: string, value: any): void {
    if (this.isEditMode && this.currentPrestation) {
      (this.currentPrestation as any)[field] = value;
    } else {
      (this.newPrestation as any)[field] = value;
    }
  }

  // 🔹 Exporter les données
  exportPDF(): void {
    console.log('Export PDF en cours...');
  }

  exportExcel(): void {
    console.log('Export Excel en cours...');
  }
}