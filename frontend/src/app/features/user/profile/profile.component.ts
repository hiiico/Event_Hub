import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { User } from '../../../shared/interfaces/user';
import { Store} from '@ngrx/store';
import {selectAuthError, selectAuthLoading, selectUpdateSuccess, selectUser} from '../../../store';
import * as AuthActions from '../../../store/auth/actions/auth.actions';
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

  ngOnInit(): void {

    this.store.select(selectUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.user = { ...user };
        }
      });

    this.store.select(selectAuthLoading)
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.loading = loading);

    this.store.select(selectAuthError)
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorMessage = error;
        } else {
          this.errorMessage = '';
        }
      });

    this.store.select(selectUpdateSuccess)
      .pipe(takeUntil(this.destroy$))
      .subscribe(success => {
        if (success) {
          this.successMessage = 'Profile updated successfully';
        }else {
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

  onSubmit() {
    if (this.loading) return;
    this.successMessage = '';
    this.errorMessage = '';

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
