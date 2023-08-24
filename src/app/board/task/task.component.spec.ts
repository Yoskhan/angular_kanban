import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TaskComponent } from './task.component';
import { State } from '../store/board.reducer';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Task } from '../tasks.model';

import { BoardComponent } from '../board.component';

const initialState: State = {
  tasks: [],
  tags: [],
  users: [],
  boardIsLoading: true,
};

const mockTask: Task = {
  id: 1,
  name: 'Task Name',
  description: 'Task Description',
  tags: [1, 2],
  assignee: 'test',
  blockedBy: [1],
  status: 'TODO',
};

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskComponent, BoardComponent],
      providers: [provideMockStore({ initialState })],
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        CommonModule,
        RouterModule,
        DragDropModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatRadioModule,
        MatOptionModule,
        MatSelectModule,
        MatCheckboxModule,
        FlexLayoutModule,
        SharedModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);

    fixture = TestBed.createComponent(TaskComponent);
    component = fixture.componentInstance;
    component.task = mockTask;
    component.tags = ['Tag 1', 'Tag 2'];
    component.tagsMap = [{ name: 'Tag 1', id: 1 }];
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should populate tags array with tag names', () => {
    const expectedTags = ['Tag 1', 'Tag 2'];
    expect(component.tags).toEqual(expectedTags);
  });

  it('should return a tag from tagsMap', () => {
    const tagFromMap = component.getTag(1);
    expect(tagFromMap).toBeDefined();
    expect(tagFromMap!.name).toBe('Tag 1');
  });

  it('should return undefined when tag is not found', () => {
    const tagFromMap = component.getTag(3);
    expect(tagFromMap).toBeUndefined();
  });
});
