import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { TagsBarComponent } from './tags-bar.component';
import * as BoardActions from '../store/board.actions';
import { BoardModule } from '../board.module';
import { Task } from '../tasks.model';
import { mockTask, mockTags } from 'src/app/utils/testing-data';

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

  it('should dispatch fetchTags action on ngOnInit', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledWith(BoardActions.fetchTags());
  });

  it('should correctly calculate precentages of tags', () => {
    component.tasks = mockTasks;
    component.tags = mockTags;

    expect(component['calculateTagPercentage']()[0].percentage).toBe(50);
  });

  it('should show legend container with every feature', () => {
    component.tasks = mockTasks;
    component.tags = mockTags;
    component['calculateTagPercentage']();

    fixture.detectChanges();

    const legendIcons = el.queryAll(By.css('.legend-container'));

    expect(legendIcons.length).toBe(2);
  });

  it('should unsubscribe on ngOnDestroy', () => {
    const unsubscribeSpy = spyOn(component['subscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
