import { authReducer } from './auth.reducer';
import { AuthState, initialAuthState } from '../auth.state';
import * as AuthActions from '../actions/auth.actions';
import { User } from '../../../shared/interfaces/user';

describe('Auth Reducer', () => {
  const mockUser: User = { id: '1', name: 'John', email: 'john@example.com' };
  const mockToken = 'fake-jwt-token';

  it('should return the default state', () => {
    const action = { type: 'Unknown' };
    const state = authReducer(undefined, action);
    expect(state).toEqual(initialAuthState);
  });

  describe('login action', () => {
    it('should set loading to true and clear error', () => {
      const action = AuthActions.login({ email: 'test@example.com', password: 'pass' });
      const state = authReducer(initialAuthState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });
  });

  describe('loginSuccess action', () => {
    it('should store token and user, set loading false', () => {
      const action = AuthActions.loginSuccess({ token: mockToken, user: mockUser });
      const state = authReducer(initialAuthState, action);
      expect(state.token).toBe(mockToken);
      expect(state.user).toEqual(mockUser);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
    });
  });

  describe('loginFailure action', () => {
    it('should set error and loading false', () => {
      const action = AuthActions.loginFailure({ error: 'Invalid credentials' });
      const state = authReducer(initialAuthState, action);
      expect(state.error).toBe('Invalid credentials');
      expect(state.loading).toBe(false);
    });
  });

  describe('register action', () => {
    it('should set loading to true and clear error', () => {
      const action = AuthActions.register({ name: 'John', email: 'john@example.com', password: 'pass' });
      const state = authReducer(initialAuthState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });
  });

  describe('registerSuccess action', () => {
    it('should store token and user, set loading false', () => {
      const action = AuthActions.registerSuccess({ token: mockToken, user: mockUser });
      const state = authReducer(initialAuthState, action);
      expect(state.token).toBe(mockToken);
      expect(state.user).toEqual(mockUser);
      expect(state.loading).toBe(false);
    });
  });

  describe('logout action', () => {
    it('should clear user, token, and reset state', () => {
      const loggedInState = {
        ...initialAuthState,
        user: mockUser,
        token: mockToken,
        loading: false,
        error: null
      };
      const action = AuthActions.logout();
      const state = authReducer(loggedInState, action);
      expect(state.user).toBe(null);
      expect(state.token).toBe(null);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
    });
  });

  describe('loadUserSuccess action', () => {
    it('should set user', () => {
      const action = AuthActions.loadUserSuccess({ user: mockUser });
      const state = authReducer(initialAuthState, action);
      expect(state.user).toEqual(mockUser);
      expect(state.loading).toBe(false);
    });
  });

  describe('loadUserFailure action', () => {
    it('should clear user and token, set loading false', () => {
      const stateWithUser = { ...initialAuthState, user: mockUser, token: mockToken };
      const action = AuthActions.loadUserFailure();
      const state = authReducer(stateWithUser, action);
      expect(state.user).toBe(null);
      expect(state.token).toBe(null);
      expect(state.loading).toBe(false);
    });
  });

  describe('updateUser action', () => {
    it('should set loading true, clear error, reset updateSuccess', () => {
      const action = AuthActions.updateUser({ name: 'Johnny', email: 'john@example.com' });
      const state = authReducer(initialAuthState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
      expect(state.updateSuccess).toBe(false);
    });
  });

  describe('updateUserSuccess action', () => {
    it('should update user, set loading false, updateSuccess true', () => {
      const action = AuthActions.updateUserSuccess({ user: { ...mockUser, name: 'Johnny' } });
      const state = authReducer(initialAuthState, action);
      expect(state.user?.name).toBe('Johnny');
      expect(state.loading).toBe(false);
      expect(state.updateSuccess).toBe(true);
    });
  });

  describe('updateUserFailure action', () => {
    it('should set error, loading false, updateSuccess false', () => {
      const action = AuthActions.updateUserFailure({ error: 'Update failed' });
      const state = authReducer(initialAuthState, action);
      expect(state.error).toBe('Update failed');
      expect(state.loading).toBe(false);
      expect(state.updateSuccess).toBe(false);
    });
  });

  describe('clearUpdateSuccess action', () => {
    it('should set updateSuccess to false', () => {
      const stateWithSuccess = { ...initialAuthState, updateSuccess: true };
      const action = AuthActions.clearUpdateSuccess();
      const state = authReducer(stateWithSuccess, action);
      expect(state.updateSuccess).toBe(false);
    });
  });

  describe('clearError action', () => {
    it('should set error to null', () => {
      const stateWithError = { ...initialAuthState, error: 'Some error' };
      const action = AuthActions.clearError();
      const state = authReducer(stateWithError, action);
      expect(state.error).toBe(null);
    });
  });
});
