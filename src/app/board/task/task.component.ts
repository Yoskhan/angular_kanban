import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Task } from '../tasks.model';
import { BoardService } from '../board-service';
import { Subscription, first } from 'rxjs';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit, OnDestroy {
  @Input() task!: Task;
  @Input() isDragging!: Boolean;
  tags: string[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private boardService: BoardService) {}

  ngOnInit(): void {
    this.boardService.tagsChanged.pipe(first()).subscribe((tags) => {
      this.task.tags.forEach((tag) => {
        const currentTag = this.boardService.getTag(tag)!;
        this.tags.push(currentTag.name);
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
