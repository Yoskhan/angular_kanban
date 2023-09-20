import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { BoardComponent } from './board.component';
import * as BoardSelectors from './store/board.selectors';
import * as BoardActions from './store/board.actions';
import { BoardModule } from './board.module';
import { AddNewTaskComponent } from './add-new-task/add-new-task.component';
import { mockTasks, mockTasks2 } from '../utils/testing-data';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let store: MockStore;
  let el: DebugElement;
  let router: Router;

  const mockState = {
    board: {
      tasks: mockTasks,
      users: [],
      tags: [],
      boardIsLoading: false,
    },
  };

  beforeEach(waitForAsync(() => {
    const initialState = {
      board: {
        tasks: [],
        users: [],
        tags: [],
      },
    };

    TestBed.configureTestingModule({
      imports: [
        BoardModule,
        RouterTestingModule.withRoutes([
          { path: 'board/create-new', component: AddNewTaskComponent },
        ]),
      ],
      providers: [provideMockStore({ initialState })],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(BoardComponent);
        component = fixture.componentInstance;
        store = TestBed.inject(MockStore);
        el = fixture.debugElement;
        router = TestBed.inject(Router);
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch fetchTasks action on ngOnInit', () => {
    const spy = spyOn(store, 'dispatch');
    const fetchTasksAction = BoardActions.fetchTasks();

    fixture.detectChanges();

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

  it("should display 'Add New Task' button", () => {
    fixture.detectChanges();

    const button = el.query(By.css('.add-new-btn'));

    expect(button).toBeTruthy();
  });

  it("clicking 'Add New Task' button should open modal", () => {
    fixture.detectChanges();

    const button = el.query(By.css('.add-new-btn'));

    const spyOnFunction = spyOn(component, 'openModal');

    button.nativeElement.click();

    expect(spyOnFunction).toHaveBeenCalled();
  });

  it('openModal function should navigate router', () => {
    fixture.detectChanges();

    const navigateSpy = spyOn(router, 'navigate');

    component.openModal();

    expect(navigateSpy).toHaveBeenCalledWith(['/board/create-new']);
  });

  it('should move task from todo to doing on drop', () => {
    fixture.detectChanges();

    component.tasks = { todo: mockTasks, doing: mockTasks2, done: [] };

    const dropEvent: any = {
      previousContainer: {
        data: component.tasks.todo,
        element: { nativeElement: document.createElement('div') },
      } as any,
      container: {
        data: component.tasks.doing,
        element: { nativeElement: document.createElement('div') },
      } as any,
      previousIndex: 0,
      currentIndex: 0,
      item: {
        element: { nativeElement: document.createElement('div') },
      } as any,
    };

    component.drop(dropEvent);

    fixture.detectChanges();

    expect(component.tasks.todo.length).toBe(2);
    expect(component.tasks.doing.length).toBe(4);
  });

  afterEach(() => {
    fixture.destroy();
  });
});
