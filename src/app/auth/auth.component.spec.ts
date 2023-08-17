import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { AuthComponent } from './auth.component';
import * as FromApp from '../store/app.reducer';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ValidateEqualModule } from 'ng-validate-equal';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as AuthActions from './store/auth.actions';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthComponent],
      imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        FormsModule,
        MatIconModule,
        MatButtonModule,
        ValidateEqualModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        StoreModule.forRoot(FromApp.appReducer),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.hidePassword).toBeTrue();
    expect(component.hideConfirmPassword).toBeTrue();
    expect(component.isLoginMode).toBeTrue();
    expect(component.error).toBeNull();
    expect(component.isLoading).toBeFalse();
  });

  it('should contain input fields for username and password', () => {
    const usernameInput = fixture.debugElement.nativeElement.querySelector('#username');
    const passwordInput = fixture.debugElement.nativeElement.querySelector('#password');

    expect(usernameInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
  });

  it('should contain a login button', () => {
    const loginButton = fixture.debugElement.nativeElement.querySelector('.login-register-btn');
    expect(loginButton.textContent).toContain('Login');
  });

  it('should contain a signup button after switching to signup mode', () => {
    // Switch to signup mode
    component.isLoginMode = false;
    fixture.detectChanges();

    const signupButton = fixture.debugElement.nativeElement.querySelector('.login-register-btn');
    expect(signupButton.textContent).toContain('Sign Up');
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

  it('should unsubscribe from subscription on component destroy', () => {
    const unsubscribeSpy = spyOn(component.subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
