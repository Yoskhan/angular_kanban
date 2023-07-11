import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from './user.model';
import { environment } from 'src/environments/environment';
import { Tasks } from '../board/tasks.model';

export interface AuthResponseData {
  data: {
    token: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  signup(username: string, password: string) {
    return this.http
      .post(`${environment.API_URL}/signup`, {
        username: username,
        name: username,
        password,
      })
      .pipe(
        tap(({ data }: any) => {
          this.handleAuthentication(username, data.token);
        })
      );
  }

  login(username: string, password: string) {
    return this.http
      .post(`${environment.API_URL}/signin`, {
        username,
        password,
      })
      .pipe(
        tap(({ data }: any) => {
          this.handleAuthentication(username, data.token);
        })
      );
  }

  private handleAuthentication(username: string, token: string, id?: string) {
    this.getUserId(token).subscribe(({ data }) => {
      const user = new User(username, token, data.id);
      this.user.next(user);
      localStorage.setItem('userData', JSON.stringify(user));
    });
  }

  private getUserId(token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<{ data: User }>(`${environment.API_URL}/me`, {
      headers,
    });
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['./auth']);
    localStorage.removeItem('userData');
  }

  autoLogin() {
    const userData: {
      username: string;
      _token: string;
      id: string;
    } = JSON.parse(localStorage.getItem('userData') as string);

    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.username,
      userData._token,
      userData.id
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
    }
  }
}
