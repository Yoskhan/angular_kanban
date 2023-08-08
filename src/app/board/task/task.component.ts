import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Task } from '../tasks.model';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as FromApp from '../../store/app.reducer';
import * as BoardSelectors from '../store/board.selectors';
import * as BoardActions from '../store/board.actions';
import { Tag } from '../tags.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit, OnDestroy {
  @Input() task!: Task;
  @Input() isDragging!: Boolean;
  tags: string[] = [];
  tagsMap: Tag[] = [];

  private subscription: Subscription = new Subscription();

  constructor(private store: Store<FromApp.AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(BoardActions.fetchTags());

    this.subscription.add(
      this.store
        .select(BoardSelectors.selectTags)
        .subscribe((tagsMap: Tag[]) => {
          this.tagsMap = tagsMap;
          let currentTags: any = [];

          if (tagsMap.length !== 0) {
            this.task.tags.forEach((tag) => {
              const currentTag = this.getTag(tag)!;
              currentTags.push(currentTag.name);
            });
          }

          this.tags = currentTags;
        })
    );
  }

  getTag(id: number): Tag | undefined {
    return this.tagsMap.find((tag) => {
      return tag.id === id;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
