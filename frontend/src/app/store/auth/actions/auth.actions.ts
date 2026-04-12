import { createAction, props } from '@ngrx/store';
import { User } from '../../../shared/interfaces/user';

// Login
export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ token: string; user: User | null }>()
);
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Register
export const register = createAction(
  '[Auth] Register',
  props<{ name: string; email: string; password: string }>()
);
export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ token: string; user: User | null}>());
export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>());

// Logout
export const logout = createAction(
  '[Auth] Logout');

// Load user from token (on app init)
export const loadUser = createAction(
  '[Auth] Load User');
export const loadUserSuccess = createAction(
  '[Auth] Load User Success',
  props<{ user: User }>());
export const loadUserFailure = createAction(
  '[Auth] Load User Failure');

// Clear error
export const clearError = createAction(
  '[Auth] Clear Error');

export const updateUser = createAction(
  '[Auth] Update User',
  props<{ name: string; email: string }>());
export const updateUserSuccess = createAction(
  '[Auth] Update User Success',
  props<{ user: User }>());
export const updateUserFailure = createAction(
  '[Auth] Update User Failure',
  props<{ error: string }>());
export const clearUpdateSuccess = createAction(
  '[Auth] Clear Update Success');
