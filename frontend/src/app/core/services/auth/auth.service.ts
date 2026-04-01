import { Injectable, inject, signal, computed, effect, WritableSignal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ApiService } from '../api/api-service';
import { User } from '../../../shared/interfaces/user';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiService = inject(ApiService);
  private tokenKey = 'eventhub_token';
  private userKey = 'eventhub_user';

  private user: WritableSignal<User | null> = signal<User | null>(null);
  user$ = toObservable(this.user); // ✅ convert signal to observable

  isAuthenticated = computed(() => !!this.user());

  constructor() {
    this.loadUserFromStorage();
    // persist user to localStorage when it changes
    effect(() => {
      const current = this.user();
      if (current) localStorage.setItem(this.userKey, JSON.stringify(current));
      else localStorage.removeItem(this.userKey);
    });
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.apiService.getCurrentUser().subscribe({
        next: user => this.user.set(user),
        error: () => this.logout()
      });
    } else {
      this.user.set(null);
    }
  }

  register(name: string, email: string, password: string) {
    return this.apiService.register(name, email, password).pipe(
      tap(token => {
        localStorage.setItem(this.tokenKey, token);
        this.apiService.getCurrentUser().subscribe(user => this.user.set(user));
      })
    );
  }

  login(email: string, password: string) {
    return this.apiService.login(email, password).pipe(
      tap(token => {
        localStorage.setItem(this.tokenKey, token);
        this.apiService.getCurrentUser().subscribe(user => this.user.set(user));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.user.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): User | null {
    return this.user();
  }

  updateUser(user: { name: string; email: string }) {
    return this.apiService.updateUser(user).pipe(
      tap(updated => this.user.set(updated))
    );
  }
}
