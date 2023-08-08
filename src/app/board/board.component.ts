import {
  CdkDrag,
  CdkDragDrop,
  CdkDragEnter,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription, map } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Task, Tasks } from './tasks.model';
import { Status as taskStatus } from './tasks.model';
import * as fromApp from '../store/app.reducer';
import * as BoardSelectors from './store/board.selectors';
import * as BoardActions from './store/board.actions';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit, OnDestroy {
  tasks: Tasks = { todo: [], doing: [], done: [] };
  taskStats = taskStatus;
  id?: number;
  editMode = false;
  isLoading$ = new Observable<boolean>();
  @Output() isDragging = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {

    this.store.dispatch(BoardActions.fetchTasks());

    this.store
      .select(BoardSelectors.selectTasks)
      .pipe(
        map((tasks: Task[]) => {
          return this.sortTasksByStatus(tasks);
        })
      )
      .subscribe((tasks: Tasks) => {
        this.tasks = tasks;
      });

      this.isLoading$ = this.store.select(BoardSelectors.selectBoardIsLoading);
  }

  private sortTasksByStatus(data: Task[]): Tasks {
    const tasks: Tasks = {
      todo: [],
      doing: [],
      done: [],
    };

    for (const key in data) {
      const status = data[key].status;

      if (status === taskStatus.TODO) {
        tasks.todo.push(data[key]);
      } else if (status === taskStatus.DOING) {
        tasks.doing.push(data[key]);
      } else if (status === taskStatus.DONE) {
        tasks.done.push(data[key]);
      }
    }

    return tasks;
  }

  closeModal() {
    this.router.navigate(['/board']);
  }

  openModal(id?: number) {
    if (!id) {
      this.router.navigate(['/board/create-new']);
    } else {
      this.router.navigate(['/board/' + id]);
    }
  }

  drop(event: CdkDragDrop<Task[]>) {
    const updatedTask = {
      ...event.previousContainer.data[event.previousIndex],
    };

    const newStatus = event.container.element.nativeElement.dataset[
      'status'
    ] as string;

    updatedTask.status = newStatus;
    this.store.dispatch(BoardActions.updateTask({ task: updatedTask }));

    const elementId = +event.item.element.nativeElement.dataset['id']!;
    const sortedNumberArray = this.sortObjectsById(event.container.data);
    const newPosition = this.insertAndReturnIndex(sortedNumberArray, elementId);

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      newPosition
    );

    this.isDragging = false;
  }

  allowDrop(item: CdkDrag<number>) {
    return (
      item.dropContainer.element.nativeElement.dataset['status'] ===
      taskStatus.DOING
    );
  }

  dragEntered(event: CdkDragEnter<[]>) {
    this.isDragging = true;
    const detachElement = event.container.element.nativeElement.querySelector(
      '.cdk-drag-placeholder'
    );

    const parent = detachElement?.parentNode;
    const elementId = +event.item.element.nativeElement.dataset['id']!;
    const sortedNumberArray = this.sortObjectsById(event.container.data);
    const newPosition = this.insertAndReturnIndex(sortedNumberArray, elementId);

    if (detachElement) {
      parent?.removeChild(detachElement);
      parent?.insertBefore(detachElement, parent?.children[newPosition]);
    }
  }

  private sortObjectsById(arr: any[]): number[] {
    const sortedObjects = arr.sort((a, b) => a.id - b.id);
    const sortedIds = sortedObjects.map((obj) => obj.id);
    return sortedIds;
  }

  private insertAndReturnIndex(arr: number[], num: number) {
    if (arr.length === 0) {
      arr.push(num);
      return 0;
    }

    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[mid] === num) {
        return mid;
      } else if (arr[mid] < num) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return left;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
