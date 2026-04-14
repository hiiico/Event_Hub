import { Injectable, inject} from '@angular/core';
import { User } from '../../../shared/interfaces/user';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import * as AuthActions from '../../../store/auth/actions/auth.actions';
import * as AuthSelectors from '../../../store/auth/selectors/auth.selectors';

@Injectable({ providedIn: 'root' })
export class AuthService {

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

  register(name: string, email: string, password: string): void {
    this.store.dispatch(AuthActions.register({ name, email, password }));
  }

  login(email: string, password: string): void {
    this.store.dispatch(AuthActions.login({ email, password }));
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  getToken(): string | null {
    return localStorage.getItem('eventhub_token');
  }

  getCurrentUser(): User | null {
    let user: User | null = null;
    this.user$.subscribe(u => user = u).unsubscribe();
    return user;
  }

  clearError(): void {
    this.store.dispatch(AuthActions.clearError());
  }
}
