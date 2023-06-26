import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnDestroy {
  hidePassword = true;
  hideConfirmPassword = true;
  isLoginMode = true;
  error = '';
  subscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  model = {
    username: '',
    password: '',
    confirmPassword: '',
  };

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    let authObs: Observable<AuthResponseData>;

    if (this.isLoginMode) {
      authObs = this.authService.login(
        form.value.username,
        this.model.password
      );
    } else {
      authObs = this.authService.signup(
        this.model.username,
        this.model.password
      );
    }

    this.subscription = authObs.subscribe(
      (resData) => {
        this.router.navigate(['./board']);
      },
      (errorMessage) => {
        this.error = errorMessage.error.error;
      }
    );
  }

  onSwitchMode(form: NgForm) {
    this.isLoginMode = !this.isLoginMode;
    this.error = '';
    form.reset();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
