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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { SharedModule } from 'src/app/shared/shared.module';

import { AddNewTaskComponent } from './add-new-task.component';
import * as BoardActions from '../store/board.actions';
import { Task } from '../tasks.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

describe('AddNewTaskComponent', () => {
  let component: AddNewTaskComponent;
  let fixture: ComponentFixture<AddNewTaskComponent>;
  let router: jasmine.SpyObj<Router>;
  let store: MockStore;

  beforeEach(async () => {
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [AddNewTaskComponent],
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
      providers: [
        provideMockStore(),
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(new Map([['id', '1']])),
          },
        },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form when in edit mode', () => {
    component.editMode = true;
    component.id = 1;

    const mockTask: Task = {
      id: 1,
      name: 'Task Name',
      description: 'Task Description',
      tags: [],
      assignee: 'test',
      blockedBy: [],
      status: 'TODO',
    };
    const mockState = {
      board: {
        tasks: [mockTask],
        users: [],
        tags: [],
      },
    };

    spyOn(store, 'select').and.returnValue(of(mockState));

    component.ngOnInit();

    expect(component.myForm).toBeTruthy();
  });

  it('should initialize form when not in edit mode', () => {
    component.editMode = false;

    spyOn(store, 'select').and.returnValue(
      of({
        board: {
          tasks: [],
          users: [],
          tags: [],
        },
      })
    );

    component.ngOnInit();

    expect(component.myForm).toBeTruthy();
  });

  it('should submit the form with correct input fields', () => {
    spyOn(store, 'dispatch');
    spyOn(component, 'onClose');

    component.editMode = false;

    component.myForm.setValue({
      id: 1,
      name: 'Task Name',
      description: 'Task Description',
      tags: [1],
      assignee: 'test',
      blockedBy: [1],
      status: 'TODO',
    });

    component.submitForm();

    expect(store.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: BoardActions.addTask.type,
      })
    );
  });

  it('should not submit the form with missing inputs', () => {
    spyOn(store, 'dispatch');

    component.editMode = false;

    component.submitForm();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should navigate to board on close', () => {
    component.onClose();
    expect(router.navigate).toHaveBeenCalledWith(['./board']);
  });

  it('should call onClose when cancel button is clicked', () => {
    spyOn(component, 'onClose');

    const cancelButton = fixture.nativeElement.querySelector('.cancel-button');
    cancelButton.click();

    expect(component.onClose).toHaveBeenCalled();
  });

  it('should call onClose when backdrop is clicked', () => {
    spyOn(component, 'onClose');

    const backdrop = fixture.nativeElement.querySelector('.backdrop');
    backdrop.click();

    expect(component.onClose).toHaveBeenCalled();
  });
});
