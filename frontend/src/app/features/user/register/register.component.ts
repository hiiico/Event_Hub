import {Component, inject} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {ApiService} from '../../../core/services/api/api-service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private apiService = inject(ApiService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  rePassword = '';
  loading = false;
  error = '';

  get passwordMismatch(): boolean {
    return this.password !== this.rePassword;
  }

  onSubmit() {
    if (this.loading) return;
    if (this.passwordMismatch) return;
    this.loading = true;
    this.error = '';
    this.apiService.register(this.name, this.email, this.password).subscribe({
      next: () => this.router.navigate(['/events']),
      error: (err) => {
        this.error = err.error?.message || 'Registration failed';
        this.loading = false;
      }
    });
  }
}
