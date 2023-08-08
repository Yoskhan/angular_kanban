import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as FromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  hidePassword = true;
  hideConfirmPassword = true;
  isLoginMode = true;
  error: string | null = '';
  subscription = new Subscription();
  isLoading = false;

  constructor(private store: Store<FromApp.AppState>) {}

  ngOnInit(): void {
    this.subscription.add(
      this.store.select('auth').subscribe((authState) => {
        this.isLoading = authState.loading;
        this.error = authState.authError;
      })
    );
  }

  model = {
    username: '',
    password: '',
    confirmPassword: '',
  };

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

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
