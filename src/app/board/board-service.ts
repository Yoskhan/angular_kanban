import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Tasks } from './tasks.model';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  boardChanged = new Subject<any>();
  private tasks: Tasks | [] = [];

  setBoard(tasks: Tasks) {
    this.tasks = tasks;
    this.boardChanged.next({ ...this.tasks });
  }

  getBoard() {
    return { ...this.tasks };
  }
}
