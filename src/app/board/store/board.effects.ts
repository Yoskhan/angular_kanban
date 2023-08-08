import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  Observable,
  catchError,
  exhaustMap,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
import { SnackbarService } from 'src/app/shared/snackbar-service';
import { Task } from '../tasks.model';
import { Users } from '../users.model';
import { Tags } from '../tags.model';
import * as BoardActions from './board.actions';
import { selectAuthUser } from 'src/app/auth/store/auth.selectors';
import { Store } from '@ngrx/store';
import * as FromApp from '../../store/app.reducer';

@Injectable()
export class BoardEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private snackbarService: SnackbarService,
    private store: Store<FromApp.AppState>
  ) {}

  fetchTasks = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.fetchTasks),
      switchMap(() => this.withAuthToken()),
      exhaustMap((headers) =>
        this.http
          .get<{ data: Task[] }>(`${environment.API_URL}/tasks`, {
            headers,
          })
          .pipe(
            map(({ data: tasks }) => BoardActions.setTasks({ tasks })),
            catchError(() => this.handleError())
          )
      )
    )
  );

  updateTask = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.updateTask),
      switchMap(({ task }) =>
        this.withAuthToken().pipe(
          exhaustMap((headers) =>
            this.http
              .put<{ data: Task }>(
                `${environment.API_URL}/task/${task.id}`,
                task,
                { headers }
              )
              .pipe(
                map(({ data: updatedTask }) =>
                  BoardActions.taskUpdated({ task: updatedTask })
                ),
                catchError(() => this.handleError())
              )
          )
        )
      )
    )
  );

  taskUpdated = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BoardActions.taskUpdated),
        tap(() => {
          this.snackbarService.showSuccessMessage('Task updated successfully');
          this.router.navigate(['./board']);
        })
      ),
    { dispatch: false }
  );

  addTask = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.addTask),
      switchMap(({ task }) =>
        this.withAuthToken().pipe(
          exhaustMap((headers) =>
            this.http
              .post<{ data: Task }>(`${environment.API_URL}/task`, task, {
                headers,
              })
              .pipe(
                map(({ data: addedTask }) =>
                  BoardActions.taskAdded({ task: addedTask })
                ),
                catchError(() => this.handleError())
              )
          )
        )
      )
    )
  );

  taskAdded = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BoardActions.taskAdded),
        tap(() => {
          this.snackbarService.showSuccessMessage('Task added successfully');
          this.router.navigate(['./board']);
        })
      ),
    { dispatch: false }
  );

  fetchUsers = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.fetchUsers),
      switchMap(() => this.withAuthToken()),
      exhaustMap((headers) =>
        this.http
          .get<{ data: Users }>(`${environment.API_URL}/users`, {
            headers,
          })
          .pipe(
            map(({ data: users }) => BoardActions.setUsers({ users })),
            catchError(() => this.handleError())
          )
      )
    )
  );

  fetchTags = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.fetchTags),
      switchMap(() => this.withAuthToken()),
      exhaustMap((headers) =>
        this.http
          .get<{ data: Tags }>(`${environment.API_URL}/tags`, {
            headers,
          })
          .pipe(
            map(({ data: tags }) => BoardActions.setTags({ tags })),
            catchError(() => this.handleError())
          )
      )
    )
  );

  private handleError = () => {
    this.snackbarService.showErrorMessage('Something went wrong!');
    return of(BoardActions.fetchFailed());
  };

  private withAuthToken(): Observable<HttpHeaders> {
    return this.store.select(selectAuthUser).pipe(
      take(1),
      map((user) => {
        const authToken = user?.token || '';
        const headers = new HttpHeaders({
          Authorization: `Bearer ${authToken}`,
        });
        return headers;
      })
    );
  }
}
