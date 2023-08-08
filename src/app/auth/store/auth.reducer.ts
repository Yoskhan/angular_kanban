import { createReducer, on } from '@ngrx/store';

import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: User | null;
  authError: string | null;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginStart, (state) => {
    return { ...state, authError: null, loading: true };
  }),
  on(AuthActions.authenticateSuccess, (state, { payload }) => {
    const user = new User(payload.username, payload._token, payload.id);
    return { ...state, authError: null, user: user, loading: false };
  }),
  on(AuthActions.authenticateFail, (state, action) => {
    return { ...state, user: null, authError: action.payload, loading: false };
  }),
  on(AuthActions.clearError, (state) => {
    return { ...state, authError: null };
  }),
  on(AuthActions.logout, (state) => {
    return { ...state, user: null };
  })
);
