import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { AddNewTaskComponent } from './add-new-task.component';
import * as BoardActions from '../store/board.actions';
import { BoardModule } from '../board.module';
import { RouterTestingModule } from '@angular/router/testing';
import { BoardComponent } from '../board.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import {
  mockTask,
  mockTaskMissingRequiredFields,
} from 'src/app/utils/testing-data';

describe('AddNewTaskComponent', () => {
  let component: AddNewTaskComponent;
  let fixture: ComponentFixture<AddNewTaskComponent>;
  let router: Router;
  let store: MockStore;
  let el: DebugElement;

  beforeEach(waitForAsync(() => {
    const initialState = {
      board: {
        tasks: [],
        users: [],
        tags: [],
      },
    };

    TestBed.configureTestingModule({
      declarations: [AddNewTaskComponent],
      imports: [
        BoardModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([
          { path: 'board', component: BoardComponent },
        ]),
      ],
      providers: [provideMockStore({ initialState })],
    })
      .compileComponents()
      .then(() => {
        store = TestBed.inject(MockStore);
        fixture = TestBed.createComponent(AddNewTaskComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        el = fixture.debugElement;
        fixture.detectChanges();
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form when in edit mode', () => {
    component.editMode = true;

    component.ngOnInit();

    expect(component.myForm).toBeTruthy();
  });

  it('should initialize form when not in edit mode', () => {
    component.editMode = false;

    component.ngOnInit();

    expect(component.myForm).toBeTruthy();
  });

  it('should submit the form with correct input fields', () => {
    spyOn(store, 'dispatch');

    component.myForm.setValue(mockTask);

    component.submitForm();

    expect(store.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: BoardActions.addTask.type,
      })
    );
  });

  it('should not submit the form with missing inputs', () => {
    spyOn(store, 'dispatch');

    component.myForm.setValue(mockTaskMissingRequiredFields);

    component.submitForm();

    expect(store.dispatch).not.toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: BoardActions.addTask.type,
      })
    );
  });

  it('should navigate to board on close', () => {
    const navigateSpy = spyOn(router, 'navigate');

    component.onClose();

    expect(navigateSpy).toHaveBeenCalledWith(['./board']);
  });

  it('should call onClose when cancel button is clicked', () => {
    spyOn(component, 'onClose');

    const cancelButton = el.query(By.css('.cancel-button'));
    cancelButton.nativeElement.click();

    expect(component.onClose).toHaveBeenCalled();
  });

  it('should call onClose when backdrop is clicked', () => {
    spyOn(component, 'onClose');

    const backdrop = el.query(By.css('.backdrop'));
    backdrop.nativeElement.click();

    expect(component.onClose).toHaveBeenCalled();
  });

  afterEach(() => {
    fixture.destroy();
  });
});
