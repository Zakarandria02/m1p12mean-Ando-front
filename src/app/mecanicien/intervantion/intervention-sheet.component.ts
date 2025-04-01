import { Component, Input, NgModule } from '@angular/core';
// import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule], 
  selector: 'app-intervention-sheet',
  templateUrl: './intervention-sheet.component.html',
  styleUrls: ['./intervention-sheet.component.css']
})
export class InterventionSheetComponent {
  @Input() intervention: any;
  
  availableParts = [
    { reference: 'P001', name: 'Plaquettes de frein avant', stock: 8 },
    { reference: 'P002', name: 'Filtre à huile', stock: 12 },
    { reference: 'P003', name: 'Batterie 12V', stock: 3 },
    { reference: 'P004', name: 'Pneu 205/55 R16', stock: 0 }
  ];
  
  selectedPart: any;
  
  addPart() {
    if (this.selectedPart && !this.intervention.parts.some((p: any) => p.reference === this.selectedPart.reference)) {
      this.intervention.parts.push({
        ...this.selectedPart,
        quantity: 1
      });
    }
  }
  
  removePart(part: any) {
    this.intervention.parts = this.intervention.parts.filter((p: any) => p !== part);
  }
  closeIntervention() {
    console.log("Intervention fermée !");
  }
  
  uploadPhoto(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.intervention.photos.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }
  
  removePhoto(photo: string) {
    this.intervention.photos = this.intervention.photos.filter((p: string) => p !== photo);
  }
  
  validateIntervention() {
    console.log('Intervention validée:', this.intervention);
    // Ici, ajouter la logique pour sauvegarder en base de données
  }
}