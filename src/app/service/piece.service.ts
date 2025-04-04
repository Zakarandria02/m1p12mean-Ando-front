import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Piece {
  _id: string;
  codearticle: string;
  marque: string;
  reference: string;
  lib: string;
  prix: number;
  Qte: number;
}

@Injectable({
  providedIn: 'root'
})
export class PieceService {
    private apiUrl = `${environment.apiUrl}/pieces`; // Adaptez l'URL à votre API

  constructor(private http: HttpClient) { }

  getAllPieces(): Observable<Piece[]> {
    return this.http.get<Piece[]>(this.apiUrl);
  }

  getPieceById(id: string): Observable<Piece> {
    return this.http.get<Piece>(`${this.apiUrl}/${id}`);
  }

  createPiece(piece: Omit<Piece, '_id'>): Observable<Piece> {
    return this.http.post<Piece>(this.apiUrl, piece);
  }

  updatePiece(id: string, piece: Partial<Piece>): Observable<Piece> {
    return this.http.put<Piece>(`${this.apiUrl}/${id}`, piece);
  }

  deletePiece(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}