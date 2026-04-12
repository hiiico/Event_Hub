import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  email = '';
  password = '';
  error: string | null = '';
  loading = false;

  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.authService.loading$.pipe(takeUntil(this.destroy$)).subscribe(loading => this.loading = loading);
    this.authService.error$.pipe(takeUntil(this.destroy$)).subscribe(error => this.error = error);
    this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) this.router.navigate(['/events']);
    });
  }

  onSubmit() {
    if (this.loading) return;
    this.authService.login(this.email, this.password);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // replace implements OnInit, OnDestroy
  // onSubmit() {
  //   if (this.loading) return;
  //   this.loading = true;
  //   this.authService.login(this.email, this.password).subscribe({
  //     next: () => this.router.navigate(['/events']),
  //     error: () => {
  //       this.error = 'Invalid credentials';
  //       this.loading = false;
  //     }
  //   });
  // }
}
