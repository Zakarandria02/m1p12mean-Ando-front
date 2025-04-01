import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../service/auth.service';
import { JwtService } from '../service/jwt.service';
import { PrestationsService } from '../service/prestations.service';
import { ReservationService } from '../service/reservation.service';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
})
export class ReservationComponent implements OnInit {
  appointmentForm: FormGroup;
  services: any[] = [];
  selectedService: any;
  showPasswordField = false;
  userExists = false;
  isAuthenticated = false;
  userRole: string | null = null;

  // Injection des services
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private serviceApi = inject(PrestationsService);
  private jwtService = inject(JwtService);
  private appointmentService = inject(ReservationService);

  constructor() {
    // Initialisation du formulaire
    this.appointmentForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // Correction de la validation de l'email
      phone: ['', Validators.required],
      auto: ['', Validators.required],
      prestationId: ['', Validators.required],
      date: ['', Validators.required],
      password: [''],
    });

    // Abonnement à l'état d'authentification de l'utilisateur
    this.authService.user$.subscribe((user) => {
      this.isAuthenticated = !!user;
      this.userRole = user?.role || null;
      if (this.isAuthenticated && user.token) {
        const decodedToken = this.jwtService.decodeToken(user.token);
      console.log('Services auth:', decodedToken);
        if (decodedToken) {
        this.appointmentForm.patchValue({
          nom: user.nom,
          email: user.email,
          phone: user.phone
        });
        this.appointmentForm.get('nom')?.disable();
        this.appointmentForm.get('email')?.disable();
        this.appointmentForm.get('phone')?.disable();
      }} else {
        this.appointmentForm.get('nom')?.enable();
        this.appointmentForm.get('email')?.enable();
        this.appointmentForm.get('phone')?.enable();
      }
      
    });
  }

  ngOnInit(): void {
    // Récupération des services disponibles
    this.serviceApi.getServices().subscribe({
      next: (data) => {
        this.services = data;
        console.log('Services récupérés:', this.services);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des services:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const formData = this.appointmentForm.getRawValue();
      this.appointmentService.createAppointment(formData)
        .subscribe({
          next: () => this.router.navigate(['/confirmation']),
          error: (err) => alert(err.error?.message || 'Erreur serveur')
        });
    } else {
      this.appointmentForm.markAllAsTouched();
      alert('Formulaire invalide');
    }}

  // onSubmit(): void {
  //   if (this.appointmentForm.valid) {
  //     const formData = this.appointmentForm.getRawValue(); // Utiliser getRawValue pour inclure les champs désactivés
  //     this.http.post('http://localhost:3000/api/appointments/', formData)
  //       .subscribe({
  //         next: () => this.router.navigate(['/confirmation']),
  //         error: (err) => alert(err.error?.message || 'Erreur serveur')
  //       });
  //   } else {
  //     this.appointmentForm.markAllAsTouched();
  //     alert('Formulaire invalide');
  //   }
  // }
}
