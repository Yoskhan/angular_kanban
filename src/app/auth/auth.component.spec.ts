import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AuthModule } from './auth.module';
import { AuthComponent } from './auth.component';
import * as AuthActions from './store/auth.actions';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { selectAuthError } from './store/auth.selectors';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let store: MockStore;
  let el: DebugElement;

  beforeEach(waitForAsync(() => {
    const initialState = {
      auth: {
        user: null,
        authError: null,
        loading: false,
      },
    };

    TestBed.configureTestingModule({
      declarations: [AuthComponent],
      imports: [AuthModule, NoopAnimationsModule],
      providers: [provideMockStore({ initialState })],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AuthComponent);
        component = fixture.componentInstance;
        store = TestBed.inject(MockStore);
        el = fixture.debugElement;
        fixture.detectChanges();
      });
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should contain input fields for username and password', () => {
    const usernameInput = el.query(By.css('#username'));
    const passwordInput = el.query(By.css('#password'));

    expect(usernameInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
  });

  it('should contain a login button', () => {
    const loginButton = el.query(By.css('.login-register-btn'));
    expect(loginButton.nativeElement.textContent).toContain('Login');
  });

  it('should contain a signup button after switching to signup mode', () => {
    // Switch to signup mode
    component.isLoginMode = false;
    fixture.detectChanges();

    const signupButton = el.query(By.css('.login-register-btn'));
    expect(signupButton.nativeElement.textContent).toContain('Sign Up');
  });

  it('should dispatch loginStart action when form is submitted in login mode', () => {
    const dispatchSpy = spyOn(component['store'], 'dispatch');
    component.isLoginMode = true;

    const formValue = {
      username: 'testuser',
      password: 'testpassword',
      confirmPassword: '',
    };

    component.model = formValue;

    component.onSubmit({
      valid: true,
      value: formValue,
    } as any);

    expect(dispatchSpy).toHaveBeenCalledWith(
      AuthActions.loginStart({
        payload: {
          username: formValue.username,
          password: formValue.password,
        },
      })
    );
  });

  it('should show error message when login fails', () => {
    selectAuthError.setResult('Login failed');

    store.refreshState();
    fixture.detectChanges();

    const errorMessage = el.query(By.css('.auth-form__errorMessage'));

    expect(errorMessage.nativeElement.textContent).toContain('Error: Login failed');
  });

  it('should switch authentication mode and clear error when switch mode is clicked', () => {
    const dispatchSpy = spyOn(component['store'], 'dispatch');

    const form = {
      reset: jasmine.createSpy('reset'),
    } as any;

    component.onSwitchMode(form);

    expect(component.isLoginMode).toBeFalse();
    expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.clearError());
    expect(form.reset).toHaveBeenCalled();
  });

  afterEach(() => {
    fixture.destroy();
  });
});
