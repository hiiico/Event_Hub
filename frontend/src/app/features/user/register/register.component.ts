import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {ApiService} from '../../../core/services/api/api-service';
import {AuthService} from '../../../core/services/auth/auth.service';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  name = '';
  email = '';
  password = '';
  rePassword = '';
  loading = false;
  error = '';

  ngOnInit(): void {

    this.authService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.loading = loading);

    this.authService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(err => this.error = err || '');

    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) this.router.navigate(['/events']);
      });
  }

  get passwordMismatch(): boolean {
    return this.password !== this.rePassword;
  }

  onSubmit() {
    if (this.loading) return;
    if (this.passwordMismatch) return;
    if (this.password.length < 6) return;
    this.error = '';
    this.authService.register(this.name, this.email, this.password);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
