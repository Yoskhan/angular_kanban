import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as FromApp from '../../store/app.reducer';
import * as FromAuth from './auth.reducer';

const selectAuthFeature = createFeatureSelector<FromAuth.State>('auth');

export const selectAuthUser = createSelector(
  selectAuthFeature,
  (authState: FromAuth.State) => authState.user
);

export const selectAuthIsLoading = createSelector(
  selectAuthFeature,
  (authState: FromAuth.State) => authState.loading
);

export const selectAuthError = createSelector(
  selectAuthFeature,
  (authState: FromAuth.State) => authState.authError
);

export const selectIsAuthenticated = createSelector(
  selectAuthFeature,
  (AuthState: FromAuth.State) => !!AuthState.user
);
