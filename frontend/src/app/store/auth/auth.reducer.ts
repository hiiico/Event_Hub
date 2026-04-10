import { createReducer, on } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,

  // Login / Register – start loading
  on(AuthActions.login, AuthActions.register, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  // Login / Register success
  on(AuthActions.loginSuccess, AuthActions.registerSuccess, (state, { token, user }) => {
    localStorage.setItem('eventhub_token', token);
    localStorage.setItem('eventhub_user', JSON.stringify(user));
    return {
      ...state,
      user,
      token,
      loading: false,
      error: null
    };
  }),

  // Login / Register failure
  on(AuthActions.loginFailure, AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load user success
  on(AuthActions.loadUserSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false
  })),

  on(AuthActions.loadUserFailure, (state) => ({
    ...state,
    loading: false,
    user: null,
    token: null
  })),

  // Logout
  on(AuthActions.logout, (state) => {
    localStorage.removeItem('eventhub_token');
    localStorage.removeItem('eventhub_user');
    return {
      ...initialAuthState,
      token: null,
      user: null
    };
  }),

  on(AuthActions.clearError, (state) => ({
    ...state,
    error: null
  })),

// Update user
  on(AuthActions.updateUser, (state) => ({
    ...state,
    loading: true,
    error: null,
    updateSuccess: false
  })),
  on(AuthActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null,
    updateSuccess: true
  })),
  on(AuthActions.updateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    updateSuccess: false
  })),
  on(AuthActions.clearUpdateSuccess, (state) => ({
    ...state,
    updateSuccess: false
  })),
);
