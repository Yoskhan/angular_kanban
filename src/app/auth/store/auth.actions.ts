import { createAction, props } from '@ngrx/store';

export const loginStart = createAction(
  '[Auth] Login Start',
  props<{ payload: { username: string; password: string } }>()
);

export const authenticateSuccess = createAction(
  '[Auth] Authenticate Success',
  props<{
    payload: {
      username: string;
      id?: string;
      _token: string;
      redirect?: boolean;
    };
  }>()
);

export const authenticateFail = createAction(
  '[Auth] Authenticate Fail',
  props<{ payload: string }>()
);

export const signupStart = createAction(
  '[Auth] Signup Start',
  props<{ payload: { username: string; password: string } }>()
);

export const clearError = createAction('[Auth] Clear Error');

export const logout = createAction('[Auth] Logout');

export const autoLogin = createAction('[Auth] Auto Login');
