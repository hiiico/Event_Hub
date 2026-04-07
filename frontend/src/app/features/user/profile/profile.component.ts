import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { User } from '../../../shared/interfaces/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User = { id: '', name: '', email: '' };
  successMessage = '';
  errorMessage = '';
  loading = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.user = { ...user };
      }
    });
  }

  onSubmit() {
    if (this.loading) return;
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.authService.updateUser({ name: this.user.name, email: this.user.email }).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.successMessage = 'Profile updated successfully';
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to update profile';
        this.loading = false;
      }
    });
  }
}
