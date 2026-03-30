import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { User } from '../../../shared/interfaces/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private usersUrl = 'http://localhost:3000/api/users';
  private tokenKey = 'eventhub_token';
  private userKey = 'eventhub_user';
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      // Fetch the current user using the token
      this.fetchCurrentUser().subscribe({
        next: (user) => this.setUser(user),
        error: () => this.logout()
      });
    } else {
      this.userSubject.next(null);
    }
  }

  private fetchCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/me`).pipe(
      catchError(err => throwError(() => err))
    );
  }

  private setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.userSubject.next(user);
  }

  register(name: string, email: string, password: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/register`, { name, email, password }, { responseType: 'text' })
      .pipe(
        tap(token => localStorage.setItem(this.tokenKey, token)),
        switchMap(() => this.fetchCurrentUser()),
        tap(user => this.setUser(user)),
        map(() => localStorage.getItem(this.tokenKey) as string)
      );
  }

  login(email: string, password: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }, { responseType: 'text' })
      .pipe(
        tap(token => localStorage.setItem(this.tokenKey, token)),
        switchMap(() => this.fetchCurrentUser()),
        tap(user => this.setUser(user)),
        map(() => localStorage.getItem(this.tokenKey) as string)
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.userSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.userSubject.getValue();
  }

  updateUser(user: { name: string; email: string }): Observable<User> {
    return this.http.put<User>(`${this.usersUrl}/me`, user).pipe(
      tap(updatedUser => this.setUser(updatedUser))
    );
  }
}
