import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { switchMap, tap, map, catchError, of } from 'rxjs';

import { environment } from 'src/environments/environment';
import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface AuthResponseData {
  data: {
    token: string;
  };
}

const handleAuthentication = (username: string, token: string, id?: string) => {
  const user = new User(username, token, id);
  localStorage.setItem('userData', JSON.stringify(user));

  return AuthActions.authenticateSuccess({
    payload: {
      username: username,
      _token: token,
      redirect: true,
    },
  });
};

const handleError = (errorMessage: any) => {
  return of(
    AuthActions.authenticateFail({
      payload: errorMessage.error.error || errorMessage.message,
    })
  );
};

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}

  authLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginStart),
      switchMap((authData) =>
        this.http
          .post<AuthResponseData>(`${environment.API_URL}/signin`, {
            username: authData.payload.username,
            password: authData.payload.password,
          })
          .pipe(
            switchMap((resData) =>
              this.getUserId(resData.data.token).pipe(
                map((userData) =>
                  handleAuthentication(
                    authData.payload.username,
                    resData.data.token,
                    userData.data.id
                  )
                )
              )
            ),
            catchError((errorMessage) => handleError(errorMessage))
          )
      )
    )
  );

  authSignup = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signupStart),
      switchMap((signupAction) =>
        this.http
          .post(`${environment.API_URL}/signup`, {
            username: signupAction.payload.username,
            name: signupAction.payload.username,
            password: signupAction.payload.password,
          })
          .pipe(
            switchMap((resData: any) =>
              this.getUserId(resData.data.token).pipe(
                map((userData) =>
                  handleAuthentication(
                    signupAction.payload.username,
                    resData.data.token,
                    userData.data.id
                  )
                )
              )
            ),
            catchError((errorMessage) => handleError(errorMessage))
          )
      )
    )
  );

  authSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.authenticateSuccess),
        tap((authSuccessAction) => {
          if (authSuccessAction.payload.redirect) {
            this.router.navigate(['./board']);
          }
        })
      ),
    { dispatch: false }
  );

  autoLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.autoLogin),
      map(() => {
        const userData: {
          username: string;
          _token: string;
          id: string;
        } = JSON.parse(localStorage.getItem('userData') as string);

        if (!userData) {
          return { type: 'NO_AUTH' };
        }

        const loadedUser = new User(
          userData.username,
          userData._token,
          userData.id
        );

        if (loadedUser.token) {
          return AuthActions.authenticateSuccess({
            payload: {
              username: loadedUser.username,
              id: loadedUser.id,
              _token: loadedUser.token,
              redirect: false,
            },
          });
        }
        return { type: 'NO_AUTH' };
      })
    )
  );

  authLogout = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem('userData');
          this.router.navigate(['./auth']);
        })
      ),
    { dispatch: false }
  );

  private getUserId(token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<{ data: User }>(`${environment.API_URL}/me`, {
      headers,
    });
  }
}
