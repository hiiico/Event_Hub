import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../../../shared/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private tokenKey = 'eventhub_token';
  private userKey = 'eventhub_user';
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem(this.tokenKey);
    const userStr = localStorage.getItem(this.userKey);
    if (token && userStr) {
      this.userSubject.next(JSON.parse(userStr));
    } else {
      this.userSubject.next(null);
    }
  }

  register(name: string, email: string, password: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/register`, { name, email, password }, { responseType: 'text' })
      .pipe(tap(token => {
        const user: User = { id: '', name, email };
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem(this.userKey, JSON.stringify(user));
        this.userSubject.next(user);
      }));
  }

  login(email: string, password: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }, { responseType: 'text' })
      .pipe(tap(token => {
        // Temporary: extract name from email (e.g., "john@example.com" -> "john")
        const name = email.split('@')[0];
        const user: User = { id: '', name, email };
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem(this.userKey, JSON.stringify(user));
        this.userSubject.next(user);
      }));
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

  private usersUrl = 'http://localhost:3000/api/users';

  updateUser(user: { name: string; email: string }): Observable<User> {
    return this.http.put<User>(`${this.usersUrl}/me`, user)
      .pipe(tap(updatedUser => {
        localStorage.setItem(this.userKey, JSON.stringify(updatedUser));
        this.userSubject.next(updatedUser);
      }));
  }
}
