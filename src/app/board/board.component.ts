import {
  CdkDrag,
  CdkDragDrop,
  CdkDragEnter,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../shared/data-storage-service';
import { BoardService } from './board-service';
import { Task, Tasks } from './tasks.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  private subscription!: Subscription;
  tasks: Tasks = { todo: [], doing: [], done: [] };

  constructor(
    private dataStorageService: DataStorageService,
    private boardService: BoardService
  ) {}

  ngOnInit(): void {
    this.dataStorageService.fetchBoard().subscribe();

    this.subscription = this.boardService.boardChanged.subscribe(
      (tasks: Tasks) => {
        this.tasks = tasks;
      }
    );
  }

  drop(event: CdkDragDrop<Task[]>) {
    const updatedTask = event.previousContainer.data[event.previousIndex];
    updatedTask.status = event.container.id;

    this.dataStorageService.updateTask(updatedTask).subscribe();

    const elementId = parseInt(event.item.element.nativeElement.id);
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
    return item.dropContainer.id === 'IN_PROGRESS';
  }

  dragEntered(event: CdkDragEnter<[]>) {
    const detachElement = event.container.element.nativeElement.querySelector(
      '.cdk-drag-placeholder'
    );

    const parent = detachElement?.parentNode;
    const elementId = parseInt(event.item.element.nativeElement.id);
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
}
