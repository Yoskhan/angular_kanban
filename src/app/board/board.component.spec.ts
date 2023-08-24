import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { BoardComponent } from './board.component';
import { TagsBarComponent } from './tags-bar/tags-bar.component';
import * as BoardSelectors from './store/board.selectors';
import * as BoardActions from './store/board.actions';
import { Task } from './tasks.model';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let mockStore: MockStore;

  const initialState = {
    board: {
      tasks: [],
      isLoading: false,
    },
  };

  const mockTasks: Task[] = [
    {
      id: 1,
      name: 'Task 1',
      status: 'TODO',
      assignee: '',
      description: '',
      tags: [],
      blockedBy: [],
    },
    {
      id: 2,
      name: 'Task 2',
      status: 'DOING',
      assignee: '',
      description: '',
      tags: [],
      blockedBy: [],
    },
    {
      id: 3,
      name: 'Task 3',
      status: 'DONE',
      assignee: '',
      description: '',
      tags: [],
      blockedBy: [],
    },
  ];

  const mockTasks2: Task[] = [
    {
      id: 1,
      name: 'Task 1',
      status: 'TODO',
      assignee: '',
      description: '',
      tags: [],
      blockedBy: [],
    },
    {
      id: 2,
      name: 'Task 2',
      status: 'DOING',
      assignee: '',
      description: '',
      tags: [],
      blockedBy: [],
    },
    {
      id: 3,
      name: 'Task 3',
      status: 'DONE',
      assignee: '',
      description: '',
      tags: [],
      blockedBy: [],
    },
  ];

  const mockState = {
    board: {
      tasks: mockTasks,
      users: [],
      tags: [],
      boardIsLoading: false,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoardComponent, TagsBarComponent],
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        DragDropModule,
        RouterTestingModule,
      ],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    mockStore = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch fetchTasks action on ngOnInit', () => {
    const spy = spyOn(mockStore, 'dispatch');
    const fetchTasksAction = BoardActions.fetchTasks();

    component.ngOnInit();

    expect(spy).toHaveBeenCalledWith(fetchTasksAction);
  });

  it('should select tasks', () => {
    const selectedTasks = BoardSelectors.selectTasks(mockState as any);
    expect(selectedTasks).toEqual(mockTasks);
  });

  it('should select boardIsLoading', () => {
    const selectedLoadingState = BoardSelectors.selectBoardIsLoading(
      mockState as any
    );
    expect(selectedLoadingState).toBe(false);
  });

  it('should move task from todo to doing on drop', () => {
    const todoList = mockTasks;
    const doingList = mockTasks2;

    const dropEvent: any = {
      previousContainer: {
        data: todoList,
        element: { nativeElement: document.createElement('div') },
      } as any,
      container: {
        data: doingList,
        element: { nativeElement: document.createElement('div') },
      } as any,
      previousIndex: 0,
      currentIndex: 0, // Insert at the beginning of the "Doing" list
      item: { element: { nativeElement: document.createElement('div') } } as any,
    };

    component.drop(dropEvent);

    expect(mockTasks.length).toBe(2);
    expect(mockTasks2.length).toBe(4);
  });

  afterEach(() => {
    fixture.destroy();
  });
});
