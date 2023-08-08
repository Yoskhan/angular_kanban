import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Task } from '../tasks.model';
import * as FromApp from '../../store/app.reducer';
import * as BoardActions from '../store/board.actions';
import * as BoardSelectors from '../store/board.selectors';
import { Tag } from '../tags.model';

type TagPercentage = { name: string; percentage: number }[];

@Component({
  selector: 'app-tags-bar',
  templateUrl: './tags-bar.component.html',
  styleUrls: ['./tags-bar.component.scss'],
})
export class TagsBarComponent implements OnInit {
  tags: Tag[] = [];
  tagsPercentages: TagPercentage = [];
  tasks: Task[] = [];

  private subscription: Subscription = new Subscription();
  constructor(private store: Store<FromApp.AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(BoardActions.fetchTags());

    this.subscription.add(
      this.store.select(BoardSelectors.selectTasks).subscribe((tasks: Task[]) => {
        this.tasks = tasks;
      })
    )

    this.subscription.add(
      this.store.select(BoardSelectors.selectTags).subscribe((tags: Tag[]) => {
        this.tags = tags;
        this.tagsPercentages = this.calculateTagPercentage();
      })
    )
  }

  private calculateTagPercentage(): TagPercentage {
    const tagCount: any = {};

    // Count the occurrences of each tag
    this.tasks.forEach((task) => {
      task.tags.forEach((tag) => {
        if (tagCount[tag] !== undefined) {
          tagCount[tag]++;
        } else {
          tagCount[tag] = 1;
        }
      });
    });

    // Calculate the total number of tags
    const totalTags = this.tasks.reduce(
      (total, task) => total + task.tags.length,
      0
    );

    // Calculate the percentage of each tag
    const tagPercentage: { [name: string]: number } = {};
    for (const tag in tagCount) {
      if (tagCount.hasOwnProperty(tag)) {
        const percentage = (tagCount[tag] / totalTags) * 100;
        tagPercentage[tag] = Math.round(percentage);
      }
    }

    const tagNames = this.tags;
    const tagPercentageArray: TagPercentage = [];

    // Convert tagPercentage object into an array of objects
    for (const mapping of tagNames) {
      const { id, name } = mapping;
      if (tagPercentage.hasOwnProperty(id.toString())) {
        const percentage = tagPercentage[id.toString()];
        tagPercentageArray.push({ name, percentage });
        delete tagPercentage[id.toString()];
      }
    }

    return tagPercentageArray;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
