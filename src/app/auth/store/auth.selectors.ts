import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as FromApp from '../../store/app.reducer';
import * as FromAuth from './auth.reducer';

export const selectAuthUser = (state: FromApp.AppState) => state.auth.user;
export const selectAuthIsLoading = (state: FromApp.AppState) => state.auth.loading;
export const selectAuthError = (state: FromApp.AppState) => state.auth.authError;

const selectAuthFeature = createFeatureSelector<FromAuth.State>('auth');

export const selectIsAuthenticated = createSelector(
  selectAuthFeature,
  (AuthState: FromAuth.State) => !!AuthState.user
);
