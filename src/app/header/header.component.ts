import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as FromApp from '../store/app.reducer';
import { selectAuthUser } from '../auth/store/auth.selectors';
import * as AuthActions from '../auth/store/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub$!: Subscription;

  constructor(
    private store: Store<FromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.userSub$ = this.store.select(selectAuthUser).subscribe((user) => {
      this.isAuthenticated = !!user;
    });
  }

  onLogout() {
    this.store.dispatch(AuthActions.logout());
  }

  ngOnDestroy(): void {
    if (this.userSub$) {
      this.userSub$.unsubscribe();
    }
  }
}
