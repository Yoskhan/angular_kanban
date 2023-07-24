import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage-service';
import { BoardService } from '../board-service';
import { Task } from '../tasks.model';

type TagPercentage = {
  [key: string]: number;
};

@Component({
  selector: 'app-tags-bar',
  templateUrl: './tags-bar.component.html',
  styleUrls: ['./tags-bar.component.scss'],
})
export class TagsBarComponent implements OnInit {
  tags: TagPercentage[] = [];
  tagsPercentages: TagPercentage[] = [];
  tasks: Task[] = [];

  private subscription: Subscription = new Subscription();
  constructor(
    private dataStorageService: DataStorageService,
    private boardService: BoardService
  ) {}

  ngOnInit(): void {
    this.subscribeToBoardChanges();
    this.subscribeToTagsChanges();
  }

  private subscribeToBoardChanges(): void {
    this.subscription.add(
      this.boardService.boardChanged.subscribe((tasks: Task[]) => {
        this.tasks = tasks;
        this.fetchTags();
      })
    );
  }

  private fetchTags(): void {
    this.subscription.add(
      this.dataStorageService.fetchTags().subscribe(() => {})
    );
  }

  private subscribeToTagsChanges(): void {
    this.subscription.add(
      this.boardService.tagsChanged.subscribe((tags: any) => {
        this.tags = tags;
        this.tagsPercentages = this.calculateTagPercentage();
      })
    );
  }

  private calculateTagPercentage(): TagPercentage[] {
    const tagCount: any = {};
    const tasks: Task[] = this.tasks;

    // Count the occurrences of each tag
    tasks.forEach((task) => {
      task.tags.forEach((tag) => {
        if (tagCount[tag] !== undefined) {
          tagCount[tag]++;
        } else {
          tagCount[tag] = 1;
        }
      });
    });

    // Calculate the total number of tags
    const totalTags = tasks.reduce(
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
    const tagPercentageArray: TagPercentage[] = [];

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
