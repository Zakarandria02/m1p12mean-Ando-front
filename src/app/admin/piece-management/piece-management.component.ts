import { Component, OnInit } from '@angular/core';
import { PieceService, Piece } from '../../service/piece.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-piece-management',
  templateUrl: './piece-management.component.html',
  styleUrls: ['./piece-management.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PieceManagementComponent implements OnInit {
  pieces: Piece[] = [];
  isLoading = false;
  errorMessage = '';
  pieceForm: FormGroup;
  
  modalState = {
    isOpen: false,
    isEditMode: false,
    currentPiece: null as Piece | null
  };

  constructor(
    private pieceService: PieceService,
    private fb: FormBuilder
  ) {
    this.pieceForm = this.fb.group({
      codearticle: ['', Validators.required],
      marque: ['', Validators.required],
      reference: ['', Validators.required],
      lib: ['', Validators.required],
      prix: [0, [Validators.required, Validators.min(0)]],
      Qte: [0, [Validators.required, Validators.min(0)]],
      seuil: [5, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadPieces();
  }

  loadPieces(): void {
    this.isLoading = true;
    this.pieceService.getAllPieces().subscribe({
      next: (data) => {
        this.pieces = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des pièces';
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  openModal(editMode = false, piece: Piece | null = null): void {
    this.modalState = { isOpen: true, isEditMode: editMode, currentPiece: piece };

    if (editMode && piece) {
      this.pieceForm.patchValue(piece);
    } else {
      this.pieceForm.reset();
    }
  }

  closeModal(): void {
    this.modalState = { isOpen: false, isEditMode: false, currentPiece: null };
  }

  deletePiece(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette pièce ?')) {
      this.pieceService.deletePiece(id).subscribe({
        next: () => this.loadPieces(),
        error: (error) => {
          console.error(error);
          this.errorMessage = 'Erreur lors de la suppression';
        }
      });
    }
  }

  onSubmit(): void {
    if (this.pieceForm.invalid) return;

    const pieceData = this.pieceForm.value;

    if (this.modalState.isEditMode && this.modalState.currentPiece) {
      this.pieceService.updatePiece(this.modalState.currentPiece._id, pieceData).subscribe({
        next: () => {
          this.loadPieces();
          this.closeModal();
        },
        error: (err) => console.error('Erreur lors de la mise à jour', err)
      });
    } else {
      this.pieceService.createPiece(pieceData).subscribe({
        next: (newPiece) => {
          this.pieces.push(newPiece);
          this.closeModal();
        },
        error: (err) => console.error('Erreur lors de la création', err)
      });
    }
  }
  readonly STOCK_ALERT_THRESHOLD = 5; // seuil critique, à ajuster
  isLowStock(piece: Piece): boolean {
    return piece.Qte <= this.STOCK_ALERT_THRESHOLD;
  }
  
}
