import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AuthService } from './auth.service';
import * as AuthActions from '../../../store/auth/auth.actions';

describe('AuthService', () => {
  let service: AuthService;
  let store: MockStore;
  const initialState = { auth: { user: null, loading: false, error: null } };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideMockStore({ initialState })
      ]
    });
    service = TestBed.inject(AuthService);
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
  });

  it('should dispatch login action', () => {
    service.login('test@example.com', 'pass');
    expect(store.dispatch).toHaveBeenCalledWith(
      AuthActions.login({ email: 'test@example.com', password: 'pass' })
    );
  });

  it('should dispatch register action', () => {
    service.register('John', 'john@example.com', 'pass');
    expect(store.dispatch).toHaveBeenCalledWith(
      AuthActions.register({ name: 'John', email: 'john@example.com', password: 'pass' })
    );
  });

  it('should dispatch logout action', () => {
    service.logout();
    expect(store.dispatch).toHaveBeenCalledWith(AuthActions.logout());
  });
});
