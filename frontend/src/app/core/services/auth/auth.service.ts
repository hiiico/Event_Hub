import { Injectable, inject, signal, computed, effect, WritableSignal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ApiService } from '../api/api-service';
import { User } from '../../../shared/interfaces/user';
import {Observable, tap} from 'rxjs';
import {Store} from '@ngrx/store';
import * as AuthActions from '../../../store/auth/actions/auth.actions';
import * as AuthSelectors from '../../../store/auth/selectors/auth.selectors';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // private apiService = inject(ApiService);
  // private tokenKey = 'eventhub_token';
  // private userKey = 'eventhub_user';
  //
  // private user: WritableSignal<User | null> = signal<User | null>(null);
  // user$ = toObservable(this.user); // ✅ convert signal to observable
  //
  // isAuthenticated = computed(() => !!this.user());
  //
  // constructor() {
  //   this.loadUserFromStorage();
  //   // persist user to localStorage when it changes
  //   effect(() => {
  //     const current = this.user();
  //     if (current) localStorage.setItem(this.userKey, JSON.stringify(current));
  //     else localStorage.removeItem(this.userKey);
  //   });
  // }

  private store = inject(Store);

  user$: Observable<User | null> = this.store.select(AuthSelectors.selectUser);
  isAuthenticated$ = this.store.select(AuthSelectors.selectIsAuthenticated);
  loading$ = this.store.select(AuthSelectors.selectAuthLoading);
  error$ = this.store.select(AuthSelectors.selectAuthError);

  updateSuccess$ = this.store.select(AuthSelectors.selectUpdateSuccess);

  isAuthenticated(): boolean {
    let isAuth = false;
    this.isAuthenticated$.subscribe(v => isAuth = v).unsubscribe();
    return isAuth;
  }

  // private loadUserFromStorage(): void {
  //   const token = localStorage.getItem(this.tokenKey);
  //   if (token) {
  //     this.apiService.getCurrentUser().subscribe({
  //       next: user => this.user.set(user),
  //       error: () => this.logout()
  //     });
  //   } else {
  //     this.user.set(null);
  //   }
  // }

  // register(name: string, email: string, password: string) {
  //   return this.apiService.register(name, email, password).pipe(
  //     tap(token => {
  //       localStorage.setItem(this.tokenKey, token);
  //       this.apiService.getCurrentUser().subscribe(user => this.user.set(user));
  //     })
  //   );
  // }

  register(name: string, email: string, password: string): void {
    this.store.dispatch(AuthActions.register({ name, email, password }));
  }

  // login(email: string, password: string) {
  //   return this.apiService.login(email, password).pipe(
  //     tap(token => {
  //       localStorage.setItem(this.tokenKey, token);
  //       this.apiService.getCurrentUser().subscribe(user => this.user.set(user));
  //     })
  //   );
  // }

  login(email: string, password: string): void {
    this.store.dispatch(AuthActions.login({ email, password }));
  }

  // logout(): void {
  //   localStorage.removeItem(this.tokenKey);
  //   localStorage.removeItem(this.userKey);
  //   this.user.set(null);
  // }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  // getToken(): string | null {
  //   return localStorage.getItem(this.tokenKey);
  // }

  getToken(): string | null {
    return localStorage.getItem('eventhub_token');
  }

  // getCurrentUser(): User | null {
  //   return this.user();
  // }

  getCurrentUser(): User | null {
    let user: User | null = null;
    this.user$.subscribe(u => user = u).unsubscribe();
    return user;
  }

  // updateUser(user: { name: string; email: string }) {
  //   return this.apiService.updateUser(user).pipe(
  //     tap(updated => this.user.set(updated))
  //   );
  // }

  updateUser(user: { name: string; email: string }): void {
    this.store.dispatch(AuthActions.updateUser(user));
  }

  clearError(): void {
    this.store.dispatch(AuthActions.clearError());
  }
}
