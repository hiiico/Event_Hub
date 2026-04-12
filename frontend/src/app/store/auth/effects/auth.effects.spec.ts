import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { AuthEffects } from './auth.effects';
import { ApiService } from '../../../core/services/api/api-service';
import { Router } from '@angular/router';
import * as AuthActions from '../actions/auth.actions';
import { User } from '../../../shared/interfaces/user';

describe('AuthEffects', () => {
  let effects: AuthEffects;
  let actions$: Observable<any>;
  let apiServiceMock: jasmine.SpyObj<ApiService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockToken = 'fake-jwt-token';
  const mockUser: User = { id: '1', name: 'John', email: 'john@example.com' };

  beforeEach(() => {
    apiServiceMock = jasmine.createSpyObj('ApiService', ['login', 'register', 'getCurrentUser', 'updateUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        { provide: ApiService, useValue: apiServiceMock },
        { provide: Router, useValue: routerSpy }
      ]
    });

    effects = TestBed.inject(AuthEffects);
  });

  describe('login$', () => {
    it('should dispatch loginSuccess on successful login', (done) => {
      const action = AuthActions.login({ email: 'test@example.com', password: 'pass' });
      actions$ = of(action);
      apiServiceMock.login.and.returnValue(of(mockToken));

      effects.login$.subscribe((result) => {
        expect(result).toEqual(AuthActions.loginSuccess({ token: mockToken, user: null }));
        done();
      });
    });

    it('should dispatch loginFailure on error', (done) => {
      const action = AuthActions.login({ email: 'test@example.com', password: 'pass' });
      actions$ = of(action);
      apiServiceMock.login.and.returnValue(throwError(() => ({ error: { message: 'Invalid' } })));

      effects.login$.subscribe((result) => {
        expect(result).toEqual(AuthActions.loginFailure({ error: 'Invalid' }));
        done();
      });
    });
  });

  describe('register$', () => {
    it('should dispatch registerSuccess on success', (done) => {
      const action = AuthActions.register({ name: 'John', email: 'john@example.com', password: 'pass' });
      actions$ = of(action);
      apiServiceMock.register.and.returnValue(of(mockToken));

      effects.register$.subscribe((result) => {
        expect(result).toEqual(AuthActions.registerSuccess({ token: mockToken, user: null }));
        done();
      });
    });
  });

  describe('loadUser$', () => {
    it('should dispatch loadUserSuccess on success', (done) => {
      const action = AuthActions.loadUser();
      actions$ = of(action);
      apiServiceMock.getCurrentUser.and.returnValue(of(mockUser));

      effects.loadUser$.subscribe((result) => {
        expect(result).toEqual(AuthActions.loadUserSuccess({ user: mockUser }));
        done();
      });
    });

    it('should dispatch loadUserFailure on error', (done) => {
      const action = AuthActions.loadUser();
      actions$ = of(action);
      apiServiceMock.getCurrentUser.and.returnValue(throwError(() => ({})));

      effects.loadUser$.subscribe((result) => {
        expect(result).toEqual(AuthActions.loadUserFailure());
        done();
      });
    });
  });

  describe('updateUser$', () => {
    it('should dispatch updateUserSuccess on success', (done) => {
      const action = AuthActions.updateUser({ name: 'Johnny', email: 'john@example.com' });
      actions$ = of(action);
      apiServiceMock.updateUser.and.returnValue(of(mockUser));

      effects.updateUser$.subscribe((result) => {
        expect(result).toEqual(AuthActions.updateUserSuccess({ user: mockUser }));
        done();
      });
    });

    it('should dispatch updateUserFailure on error', (done) => {
      const action = AuthActions.updateUser({ name: 'Johnny', email: 'john@example.com' });
      actions$ = of(action);
      apiServiceMock.updateUser.and.returnValue(throwError(() => ({ error: { message: 'Failed' } })));

      effects.updateUser$.subscribe((result) => {
        expect(result).toEqual(AuthActions.updateUserFailure({ error: 'Failed' }));
        done();
      });
    });
  });

  describe('redirectAfterAuth$', () => {
    it('should navigate to /events after loginSuccess', (done) => {
      const action = AuthActions.loginSuccess({ token: mockToken, user: null });
      actions$ = of(action);
      effects.redirectAfterAuth$.subscribe(() => {
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/events']);
        done();
      });
    });

    it('should navigate to /events after registerSuccess', (done) => {
      const action = AuthActions.registerSuccess({ token: mockToken, user: null });
      actions$ = of(action);
      effects.redirectAfterAuth$.subscribe(() => {
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/events']);
        done();
      });
    });
  });

  describe('logout$', () => {
    it('should navigate to /events after logout', (done) => {
      const action = AuthActions.logout();
      actions$ = of(action);
      effects.logout$.subscribe(() => {
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/events']);
        done();
      });
    });
  });

  describe('clearUpdateSuccess$', () => {
    it('should dispatch clearUpdateSuccess after delay', (done) => {
      const action = AuthActions.updateUserSuccess({ user: mockUser });
      actions$ = of(action);
      effects.clearUpdateSuccess$.subscribe((result) => {
        expect(result).toEqual(AuthActions.clearUpdateSuccess());
        done();
      });
    });
  });
});
