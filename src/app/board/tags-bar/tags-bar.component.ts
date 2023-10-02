import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as FromApp from '../../store/app.reducer';
import * as BoardSelectors from '../store/board.selectors';
import { Tag } from '../tags.model';

@Component({
  selector: 'app-tags-bar',
  templateUrl: './tags-bar.component.html',
  styleUrls: ['./tags-bar.component.scss'],
})
export class TagsBarComponent {
  tags: Observable<Tag[]> = this.store.select(BoardSelectors.selectTags);
  tagsPercentages: Observable<any> = this.store.select(
    BoardSelectors.selectTagsPercentages
  );

  constructor(private store: Store<FromApp.AppState>) {}
}
