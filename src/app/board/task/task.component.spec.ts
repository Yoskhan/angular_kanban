import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { TaskComponent } from './task.component';
import * as BoardActions from '../store/board.actions';
import { BoardModule } from '../board.module';
import { mockTask } from 'src/app/utils/testing-data';

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;
  let el: DebugElement;
  let store: MockStore;

  const initialState = {};

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })],
      imports: [BoardModule],
    })
      .compileComponents()
      .then(() => {
        store = TestBed.inject(MockStore);

        fixture = TestBed.createComponent(TaskComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
      });
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch fetchTags action on ngOnInit', () => {
    component.task = mockTask;

    const dispatchSpy = spyOn(store, 'dispatch');

    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledWith(BoardActions.fetchTags());
  });

  it('should show task title', () => {
    component.task = mockTask;

    fixture.detectChanges();

    const title = el.query(By.css('mat-card-title'));

    expect(title.nativeElement.textContent).toBe('Task Name');
  });

  it('should show task description', () => {
    component.task = mockTask;

    fixture.detectChanges();

    const description = el.query(By.css('mat-card-content'));

    expect(description.nativeElement.textContent).toBe('Task Description');
  });

  it('should populate tags array with tag names', () => {
    component.task = mockTask;
    component.tags = ['Tag 1', 'Tag 2'];

    fixture.detectChanges();

    const tags = el.query(By.css('.tags-container'));

    expect(tags.nativeElement.children[0].className).toBe('tag 1 Tag');
    expect(tags.nativeElement.children[1].className).toBe('tag 2 Tag');
  });

  it('should return a tag from tagsMap', () => {
    component.tagsMap = [{ name: 'Tag 1', id: 1 }];

    const tagFromMap = component.getTag(1);

    expect(tagFromMap).toBeDefined();
    expect(tagFromMap!.name).toBe('Tag 1');
  });

  it('should return undefined when tag is not found', () => {
    const tagFromMap = component.getTag(3);
    expect(tagFromMap).toBeUndefined();
  });

  it('should unsubscribe on ngOnDestroy', () => {
    const unsubscribeSpy = spyOn(component['subscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  afterEach(() => {
    fixture.destroy();
  });
});
