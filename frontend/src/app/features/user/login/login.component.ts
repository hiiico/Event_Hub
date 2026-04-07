import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.loading) return;
    this.loading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/events']),
      error: () => {
        this.error = 'Invalid credentials';
        this.loading = false;
      }
    });
  }
}
