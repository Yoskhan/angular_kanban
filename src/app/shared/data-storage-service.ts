import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Subscription, exhaustMap, map, take, tap } from 'rxjs';
import { BoardService } from '../board/board-service';
import { Task, Tasks } from '../board/tasks.model';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService implements OnInit, OnDestroy {
  private userSub$!: Subscription;
  private authToken = '';

  constructor(
    private http: HttpClient,
    private boardService: BoardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}
  fetchBoard() {
    return this.authService.user.pipe(
      take(1), // Take only the first emission from the user observable
      exhaustMap((user) => {
        this.authToken = user?.token || '';

        const headers = new HttpHeaders({
          Authorization: `Bearer ${this.authToken}`,
        });

        return this.http.get<Tasks>(`${environment.API_URL}/tasks`, {
          headers,
        });
      }),
      map((tasks) => this.sortTasksByStatus(tasks)),
      tap((tasks) => {
        this.boardService.setBoard(tasks);
      })
    );
  }

  updateTask(task: Task) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        this.authToken = user?.token || '';

        const headers = new HttpHeaders({
          Authorization: `Bearer ${this.authToken}`,
        });

        return this.http.put<Tasks>(
          `${environment.API_URL}/task/${task.id}`,
          task,
          { headers }
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.userSub$.unsubscribe();
  }

  private sortTasksByStatus(data: any) {
    const tasks: Tasks = {
      todo: [],
      doing: [],
      done: [],
    };

    for (const task of data.data) {
      const status = task.status;
      if (status === 'TODO') {
        tasks.todo.push(task);
      } else if (status === 'IN_PROGRESS') {
        tasks.doing.push(task);
      } else if (status === 'DONE') {
        tasks.done.push(task);
      }
    }

    return tasks;
  }
}
