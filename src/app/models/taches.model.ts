// models/tache.model.ts
import { User } from "./user.model";
import { Appointment } from "./appointment.model";
export interface Auto {
    _id: string;
    marque: string;
    modele: string;
    annee: string;
  }
  
  export interface Prestation {
    _id: string;
    nom: string;
    description: string;
    prix: number;
  }
  
  export interface TacheMecano {
    _id: string;
    appointment: Appointment;
    user: User;
    statut: 'En Attente' | 'En Cours' | 'Terminé';
  }