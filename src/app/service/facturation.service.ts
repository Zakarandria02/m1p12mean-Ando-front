import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Invoice } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class FacturationService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}
  
    generateInvoice(devisId: string): Observable<Invoice> {
      return this.http.post<Invoice>(`${this.apiUrl}/generate/${devisId}`, {});
    }
  
    getInvoice(invoiceId: string): Observable<Invoice> {
      return this.http.get<Invoice>(`${this.apiUrl}/${invoiceId}`);
    }
  
    markAsPaid(invoiceId: string): Observable<Invoice> {
      return this.http.patch<Invoice>(`${this.apiUrl}/${invoiceId}/pay`, {});
    }
  
    getAllInvoices(): Observable<Invoice[]> {
      return this.http.get<Invoice[]>(`${this.apiUrl}/paye/listeFacture`);
    }
  
}
