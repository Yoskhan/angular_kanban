import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { TagsBarComponent } from './tags-bar.component';
import { BoardModule } from '../board.module';
import { Task } from '../tasks.model';
import { mockTask, mockTags } from 'src/app/utils/testing-data';
import * as BoardSelectors from '../store/board.selectors';

const mockTasks: Task[] = [mockTask];

describe('TagsBarComponent', () => {
  let component: TagsBarComponent;
  let fixture: ComponentFixture<TagsBarComponent>;
  let el: DebugElement;
  let store: MockStore;

  const initialState = {};

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BoardModule],
      providers: [provideMockStore({ initialState })],
    })
      .compileComponents()
      .then(() => {
        store = TestBed.inject(MockStore);

        fixture = TestBed.createComponent(TagsBarComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
      });
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show legend container with every feature', () => {
    BoardSelectors.selectTags.setResult(mockTags);
    BoardSelectors.selectTasks.setResult(mockTasks);

    store.refreshState();
    fixture.detectChanges();

    const legendIcons = el.queryAll(By.css('.legend-container'));

    expect(legendIcons.length).toBe(2);
  });
});
