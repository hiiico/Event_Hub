import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { selectUser, selectToken, selectIsAuthenticated, selectAuthLoading, selectAuthError, selectUpdateSuccess } from './auth.selectors';
import { AuthState } from '../auth.state';
import { User } from '../../../shared/interfaces/user';

describe('Auth Selectors', () => {
  let store: MockStore;
  const mockUser: User = { id: '1', name: 'John', email: 'john@example.com' };

  const initialState: { auth: AuthState } = {
    auth: {
      user: mockUser,
      token: 'fake-token',
      loading: false,
      error: null,
      updateSuccess: true
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })]
    });
    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    // Reset all selectors to avoid state leakage between tests
    store?.resetSelectors();
  });

  it('should select the user', () => {
    let result: User | null | undefined;
    store.select(selectUser).subscribe(user => result = user);
    expect(result).toEqual(mockUser);
  });

  it('should select the token', () => {
    let result: string | null | undefined;
    store.select(selectToken).subscribe(token => result = token);
    expect(result).toBe('fake-token');
  });

  it('should select isAuthenticated (true when user exists)', () => {
    let result: boolean | undefined;
    store.select(selectIsAuthenticated).subscribe(isAuth => result = isAuth);
    expect(result).toBe(true);
  });

  it('should select loading state', () => {
    let result: boolean | undefined;
    store.select(selectAuthLoading).subscribe(loading => result = loading);
    expect(result).toBe(false);
  });

  it('should select error state', () => {
    let result: string | null | undefined;
    store.select(selectAuthError).subscribe(error => result = error);
    expect(result).toBe(null);
  });

  it('should select updateSuccess', () => {
    let result: boolean | undefined;
    store.select(selectUpdateSuccess).subscribe(success => result = success);
    expect(result).toBe(true);
  });

  it('should return false for isAuthenticated when user is null', () => {
    // Override the user selector to return null
    store.overrideSelector(selectUser, null);
    store.refreshState();
    let result: boolean | undefined;
    store.select(selectIsAuthenticated).subscribe(isAuth => result = isAuth);
    expect(result).toBe(false);
  });
});
