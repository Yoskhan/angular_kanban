import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as FromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';
import { selectAuthError } from './store/auth.selectors';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  hidePassword = true;
  hideConfirmPassword = true;
  isLoginMode = true;
  error = this.store.select(selectAuthError);
  model = {
    username: '',
    password: '',
    confirmPassword: '',
  };

  constructor(private store: Store<FromApp.AppState>) {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    if (this.isLoginMode) {
      this.store.dispatch(
        AuthActions.loginStart({
          payload: {
            username: form.value.username,
            password: this.model.password,
          },
        })
      );
    } else {
      this.store.dispatch(
        AuthActions.signupStart({
          payload: {
            username: form.value.username,
            password: this.model.password,
          },
        })
      );
    }
  }

  onSwitchMode(form: NgForm) {
    this.isLoginMode = !this.isLoginMode;
    this.store.dispatch(AuthActions.clearError());
    form.reset();
  }
}
