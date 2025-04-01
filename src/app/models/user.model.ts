export interface User {
    _id: string;
    nom: string;
    prenom?: string;
    email: string;
    phone: string;
    role: 'admin' | 'mechanic' | 'client';
    password?: string; // Uniquement pour la création/mise à jour
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  // Pour la création d'utilisateur (sans _id)
  export type CreateUserDto = Omit<User, '_id' | 'createdAt' | 'updatedAt'>;
  
  // Pour la mise à jour (tous les champs optionnels sauf _id)
  export type UpdateUserDto = Partial<Omit<User, '_id'>> & { _id: string };