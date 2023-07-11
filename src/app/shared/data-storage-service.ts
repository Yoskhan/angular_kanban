import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, exhaustMap, map, take, tap } from 'rxjs';
import { BoardService } from '../board/board-service';
import { Task, Tasks } from '../board/tasks.model';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Users } from '../board/users.model';
import { Tags } from '../board/tags.model';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private boardService: BoardService,
    private authService: AuthService
  ) {}

  fetchBoard() {
    return this.withAuthToken().pipe(
      exhaustMap((headers) => {
        return this.http.get<{ data: Task[] }>(`${environment.API_URL}/tasks`, {
          headers,
        });
      }),
      tap(({ data: tasks }) => {
        this.boardService.setBoard(tasks);
      })
    );
  }

  createTask(task: Task) {
    return this.withAuthToken().pipe(
      exhaustMap((headers) => {
        let newTask = task;
        newTask.status = 'TODO';

        return this.http.post<{ data: Task }>(
          `${environment.API_URL}/task`,
          task,
          {
            headers,
          }
        );
      })
    );
  }

  updateTask(task: Task) {
    return this.withAuthToken().pipe(
      exhaustMap((headers) => {
        return this.http.put<Tasks>(
          `${environment.API_URL}/task/${task.id}`,
          task,
          { headers }
        );
      })
    );
  }

  fetchUsers() {
    return this.withAuthToken().pipe(
      exhaustMap((headers) => {
        return this.http.get<{ data: Users }>(`${environment.API_URL}/users`, {
          headers,
        });
      }),
      tap(({ data }) => {
        this.boardService.setUsers(data);
      })
    );
  }

  fetchTags() {
    return this.withAuthToken().pipe(
      exhaustMap((headers) => {
        return this.http.get<{ data: Tags }>(`${environment.API_URL}/tags`, {
          headers,
        });
      }),
      tap(({ data }) => {
        this.boardService.setTags(data);
      })
    );
  }

  private withAuthToken(): Observable<HttpHeaders> {
    return this.authService.user.pipe(
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
