import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Status as taskStatus } from '../tasks.model';
import { User } from '../users.model';
import { Tag } from '../tags.model';
import { Task } from '../tasks.model';

import * as fromApp from '../../store/app.reducer';
import * as BoardActions from '../store/board.actions';
import * as BoardSelectors from '../store/board.selectors';

@Component({
  selector: 'app-add-new-task',
  templateUrl: './add-new-task.component.html',
  styleUrls: ['./add-new-task.component.scss'],
})
export class AddNewTaskComponent implements OnInit, OnDestroy {
  @Input() message = '';
  @Output() close = new EventEmitter<void>();

  myForm!: FormGroup;
  users: User[] = [];
  tasks: Task[] = [];
  tags: Tag[] = [];
  id?: number | null;
  editMode = false;
  status = [
    { id: taskStatus.TODO, title: 'ToDo' },
    { id: taskStatus.DOING, title: 'Doing' },
    { id: taskStatus.DONE, title: 'Done' },
  ];

  private subscription: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.id = +id;
        this.editMode = true;
      }
    });

    this.myForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      tags: [[]],
      assignee: ['', Validators.required],
      blockedBy: [[]],
      id: [],
      status: ['TODO'],
    });

    this.store.dispatch(BoardActions.fetchUsers());
    this.subscribeToChanges();
    this.initForm();
  }

  private subscribeToChanges() {
    this.subscription.add(
      this.store.select(BoardSelectors.selectUsers).subscribe((users: User[]) => {
        this.users = users;
      })
    );

    this.subscription.add(
      this.store.select(BoardSelectors.selectTags).subscribe((tags: Tag[]) => {
        this.tags = tags;
      })
    );

    this.subscription.add(
      this.store.select(BoardSelectors.selectTasks).subscribe((tasks: Task[]) => {
        this.tasks = tasks;
      })
    );
  }

  private initForm = () => {
    if (this.editMode && this.id) {
      this.store
        .select(BoardSelectors.selectTaskById(this.id))
        .subscribe((task) => {
          this.myForm = this.formBuilder.group({
            name: [task?.name, Validators.required],
            description: [task?.description, Validators.required],
            tags: [task?.tags],
            assignee: [task?.assignee, Validators.required],
            blockedBy: [task?.blockedBy],
            id: [task?.id],
            status: [task?.status],
          });
        });
    } else {
      this.myForm = this.formBuilder.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        tags: [[]],
        assignee: ['', Validators.required],
        blockedBy: [[]],
        id: [],
        status: ['TODO'],
      });
    }
  };

  submitForm() {
    if (this.myForm.valid) {
      if (this.editMode) {
        this.store.dispatch(
          BoardActions.updateTask({ task: this.myForm.value })
        );
      } else {
        // When creating new Task Id property should not be in object
        // that is requirement from backend, and it will add id automatically
        delete this.myForm.value.id;
        this.store.dispatch(BoardActions.addTask({ task: this.myForm.value }));
      }
    } else {
      // Form is invalid, show error messages
      this.myForm.markAllAsTouched();
    }
  }

  onClose() {
    this.router.navigate(['./board']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
