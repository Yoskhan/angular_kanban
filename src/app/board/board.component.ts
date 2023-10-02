import {
  CdkDrag,
  CdkDragDrop,
  CdkDragEnter,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
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
export class BoardComponent implements OnInit {
  tasks$: Observable<Tasks> = this.store.select(
    BoardSelectors.selectSortedTasksByStatus
  );
  taskStats = taskStatus;
  id?: number;
  editMode = false;
  isLoading$ = this.store.select(BoardSelectors.selectBoardIsLoading);
  isDragging = false;

  constructor(private router: Router, private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(BoardActions.fetchTasks());
  }

  closeModal() {
    this.router.navigate(['/board']);
  }

  openModal(id?: number) {
    const route = id ? ['/board', id] : ['/board/create-new'];
    this.router.navigate(route);
  }

  drop(event: CdkDragDrop<Task[] | undefined>) {
    const { previousContainer, container, previousIndex, item } = event;
    const prevData = previousContainer.data;
    const contData = container.data;

    if (!prevData || !contData || previousIndex == null) return;

    const updatedTask = { ...prevData[previousIndex] };
    const newStatus = container.element.nativeElement.dataset[
      'status'
    ] as string;

    if (!newStatus || !updatedTask) return;

    updatedTask.status = newStatus;
    this.store.dispatch(BoardActions.updateTask({ task: updatedTask }));

    const elementId = +item.element.nativeElement.dataset['id']!;
    const sortedNumberArray = this.sortObjectsById(contData);
    const newPosition = this.insertAndReturnIndex(sortedNumberArray, elementId);

    if (newPosition != null) {
      transferArrayItem(prevData, contData, previousIndex, newPosition);
      this.isDragging = false;
    }
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

  private sortObjectsById(arr: Task[]): number[] {
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
}
