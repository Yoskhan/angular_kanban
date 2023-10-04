import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Task } from '../tasks.model';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import * as FromApp from '../../store/app.reducer';
import * as BoardSelectors from '../store/board.selectors';
import * as BoardActions from '../store/board.actions';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit, OnChanges {
  @Input() task!: Task | null;
  @Input() isDragging!: boolean;
  tags$: Observable<string[]> = of([]);

  constructor(private store: Store<FromApp.AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(BoardActions.fetchTags());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('task' in changes && this.task) {
      this.tags$ = this.store.select(
        BoardSelectors.selectTagsByTask(this.task)
      );
    }
  }
}
