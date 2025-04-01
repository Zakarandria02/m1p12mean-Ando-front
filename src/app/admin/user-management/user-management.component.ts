import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { User, CreateUserDto } from '../../models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  imports: [
    FormsModule, CommonModule // Ajoutez cette ligne
  ],
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  currentUser: User | null = null;
  isEditMode = false;
  newUser: CreateUserDto = {
    nom: '',
    email: '',
    phone: '',
    role: 'client',
    password: ''
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => this.users = users,
      error: (err) => console.error('Erreur lors du chargement', err)
    });
  }

  createUser(): void {
    this.userService.createUser(this.newUser).subscribe({
      next: (user) => {
        this.users.push(user);
        this.resetForm();
      },
      error: (err) => console.error('Erreur lors de la création', err)
    });
  }

  editUser(user: User): void {
    this.currentUser = { ...user };
    this.isEditMode = true;
  }

  updateUser(): void {
    if (!this.currentUser) return;
    
    const { _id, ...updateData } = this.currentUser;
    this.userService.updateUser(_id, updateData).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u._id === updatedUser._id);
        if (index !== -1) this.users[index] = updatedUser;
        this.cancelEdit();
      },
      error: (err) => console.error('Erreur lors de la mise à jour', err)
    });
  }

  deleteUser(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => this.users = this.users.filter(u => u._id !== id),
        error: (err) => console.error('Erreur lors de la suppression', err)
      });
    }
  }

  resetForm(): void {
    this.newUser = {
      nom: '',
      email: '',
      phone: '',
      role: 'client',
      password: ''
    };
  }

  cancelEdit(): void {
    this.currentUser = null;
    this.isEditMode = false;
  }

  getCurrentRole(): any {
    return this.isEditMode ? this.currentUser?.role || 'client' : this.newUser.role;
  }
  
  setCurrentRole(role: any): void {
    if (this.isEditMode && this.currentUser) {
      this.currentUser.role = role;
    } else {
      this.newUser.role = role;
    }
  }
  
  updateModel(field: string, value: any): void {
    if (this.isEditMode && this.currentUser) {
        (this.currentUser as any)[field] = value;
    } else {
        (this.newUser as any)[field] = value;
    }
}
}