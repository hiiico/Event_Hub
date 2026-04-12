import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(selectAuthState, (state) => state.user);
export const selectToken = createSelector(selectAuthState, (state) => state.token);
export const selectIsAuthenticated = createSelector(selectUser, (user) => !!user);
export const selectAuthLoading = createSelector(selectAuthState, (state) => state.loading);
export const selectAuthError = createSelector(selectAuthState, (state) => state.error);
export const selectUpdateLoading = createSelector(selectAuthState, (state) => state.loading);
export const selectUpdateError = createSelector(selectAuthState, (state) => state.error);
export const selectUpdateSuccess = createSelector(selectAuthState, (state) => state.updateSuccess);
