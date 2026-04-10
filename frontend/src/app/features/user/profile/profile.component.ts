import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { User } from '../../../shared/interfaces/user';
import { Store} from '@ngrx/store';
import {selectAuthError, selectAuthLoading, selectUpdateSuccess, selectUser} from '../../../store';
import * as AuthActions from '../../../store/auth/auth.actions';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User = { id: '', name: '', email: '' };
  successMessage = '';
  errorMessage = '';
  loading = false;

  private destroy$ = new Subject<void>();
  private store = inject(Store);
  private authService = inject(AuthService);

  // remove OnDestroy
  // private authService = inject(AuthService);
  // ngOnInit(): void {
  //   this.authService.user$.subscribe(user => {
  //     if (user) {
  //       this.user = { ...user };
  //     }
  //   });
  // }

  ngOnInit(): void {
    // Subscribe to user from store
    this.store.select(selectUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.user = { ...user };
        }
      });

    // Subscribe to loading state
    this.store.select(selectAuthLoading)
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.loading = loading);

    // Subscribe to error state
    this.store.select(selectAuthError)
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorMessage = error;
        } else {
          this.errorMessage = '';
        }
      });

    // listening to updateSuccess
    this.store.select(selectUpdateSuccess)
      .pipe(takeUntil(this.destroy$))
      .subscribe(success => {
        if (success) {
          this.successMessage = 'Profile updated successfully';
          // Optionally auto-clear message after delay (but effect clears flag)
        }else {
          // When success flag becomes false (after clear), you might also clear the message,
          // but we want the message to disappear. So we can set successMessage = '' here.
          this.successMessage = '';
        }
      });

    this.authService.updateSuccess$
      .pipe(takeUntil(this.destroy$))
      .subscribe(success => {
        if (success) {
          this.successMessage = 'Profile updated successfully';
        } else {
          this.successMessage = '';
        }
      });
  }

  // onSubmit() {
  //   if (this.loading) return;
  //   this.loading = true;
  //   this.successMessage = '';
  //   this.errorMessage = '';
  //
  //   this.authService.updateUser({ name: this.user.name, email: this.user.email }).subscribe({
  //     next: (updatedUser) => {
  //       this.user = updatedUser;
  //       this.successMessage = 'Profile updated successfully';
  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       this.errorMessage = err.error?.message || 'Failed to update profile';
  //       this.loading = false;
  //     }
  //   });
  // }

  onSubmit() {
    if (this.loading) return;
    this.successMessage = '';
    this.errorMessage = '';

    // Dispatch update action
    this.store.dispatch(AuthActions.updateUser({
      name: this.user.name,
      email: this.user.email
    }));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
