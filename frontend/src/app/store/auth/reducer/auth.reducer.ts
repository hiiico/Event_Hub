import { createReducer, on } from '@ngrx/store';
import { AuthState, initialAuthState } from '../auth.state';
import * as AuthActions from '../actions/auth.actions';

export const authReducer = createReducer(
  initialAuthState,

  on(AuthActions.login, AuthActions.register, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

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

  on(AuthActions.loginFailure, AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

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
