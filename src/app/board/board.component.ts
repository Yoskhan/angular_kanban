import {
  CdkDrag,
  CdkDragDrop,
  CdkDragEnter,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataStorageService } from '../shared/data-storage-service';
import { BoardService } from './board-service';
import { Task, Tasks } from './tasks.model';
import { Subscription } from 'rxjs';
import { Status as taskStatus } from './tasks.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit, OnDestroy {
  tasks: Tasks = { todo: [], doing: [], done: [] };
  taskStats = taskStatus;
  modalOpened = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private dataStorageService: DataStorageService,
    private boardService: BoardService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activateModalOnRouteChange();

    this.dataStorageService.fetchBoard().subscribe();

    this.subscription.add(
      this.boardService.boardChanged.subscribe((tasks: Task[]) => {
        this.tasks = this.sortTasksByStatus(tasks);
      })
    );
  }

  private sortTasksByStatus(data: Task[]) {
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
    this.modalOpened = false;
  }

  openModal() {
    this.router.navigate(['/board/create-new']);
    this.modalOpened = true;
  }

  drop(event: CdkDragDrop<Task[]>) {
    const updatedTask = event.previousContainer.data[event.previousIndex];

    updatedTask.status = event.container.element.nativeElement.dataset[
      'status'
    ] as string;

    this.dataStorageService.updateTask(updatedTask).subscribe();

    const elementId = +event.item.element.nativeElement.dataset['id']!;
    const sortedNumberArray = this.sortObjectsById(event.container.data);
    const newPosition = this.insertAndReturnIndex(sortedNumberArray, elementId);

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      newPosition
    );
  }

  allowDrop(item: CdkDrag<number>) {
    return (
      item.dropContainer.element.nativeElement.dataset['status'] ===
      taskStatus.DOING
    );
  }

  dragEntered(event: CdkDragEnter<[]>) {
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

  private activateModalOnRouteChange() {
    this.modalOpened =
      this.route.snapshot.firstChild?.url[0]?.path === 'create-new'
        ? true
        : false;

    // This part is needed if a user goes to the route '/board/create-new'
    // using back button in browser (& mobile)
    this.subscription.add(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.modalOpened = event.url.includes('create-new') ? true : false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
