import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import * as FromApp from '../store/app.reducer';
import { selectIsAuthenticated } from '../auth/store/auth.selectors';
import * as AuthActions from '../auth/store/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isAuthenticated$ = this.store.select(selectIsAuthenticated);

  constructor(private store: Store<FromApp.AppState>) {}

  onLogout() {
    this.store.dispatch(AuthActions.logout());
  }
}
