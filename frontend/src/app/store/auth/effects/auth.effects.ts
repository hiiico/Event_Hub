import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {delay, of} from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api/api-service';
import * as AuthActions from '../actions/auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private apiService = inject(ApiService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ email, password }) =>
        this.apiService.login(email, password).pipe(
          map((token) => AuthActions.loginSuccess({ token, user: null as any })), // user will be fetched separately
          catchError((err) => of(AuthActions.loginFailure({ error: err.error?.message || 'Login failed' })))
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(({ name, email, password }) =>
        this.apiService.register(name, email, password).pipe(
          map((token) => AuthActions.registerSuccess({ token, user: null as any })),
          catchError((err) => of(AuthActions.registerFailure({ error: err.error?.message || 'Registration failed' })))
        )
      )
    )
  );

  loadUserAfterAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess, AuthActions.registerSuccess),
      map(() => AuthActions.loadUser())
    )
  );

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadUser),
      exhaustMap(() =>
        this.apiService.getCurrentUser().pipe(
          map((user) => AuthActions.loadUserSuccess({ user })),
          catchError(() => of(AuthActions.loadUserFailure()))
        )
      )
    )
  );

  redirectAfterAuth$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess, AuthActions.registerSuccess),
        tap(() => this.router.navigate(['/events']))
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem('eventhub_token');
          localStorage.removeItem('eventhub_user');
          this.router.navigate(['/events']);
        })
      ),
    { dispatch: false }
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateUser),
      exhaustMap(({ name, email }) =>
        this.apiService.updateUser({ name, email }).pipe(
          map((user) => AuthActions.updateUserSuccess({ user })),
          catchError((err) =>
            of(AuthActions.updateUserFailure({ error: err.error?.message || 'Update failed' }))
          )
        )
      )
    )
  );

  clearUpdateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateUserSuccess),
      delay(3000),
      map(() => AuthActions.clearUpdateSuccess())
    )
  );
}
