import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataStorageService } from 'src/app/shared/data-storage-service';
import { BoardService } from '../board-service';
import { Status as taskStatus } from '../tasks.model';
import { User } from '../users.model';
import { Tag } from '../tags.model';
import { Task } from '../tasks.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SnackbarService } from 'src/app/shared/snackbar-service';

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
    private dataStorageService: DataStorageService,
    private boardService: BoardService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.id = +id;
        this.editMode = true;
      }
    });

    this.loadData();
    this.subscribeToChanges();
    this.initForm();
  }

  private loadData() {
    this.subscription.add(this.dataStorageService.fetchUsers().subscribe((resData)=>{},(error)=>{
      this.snackbarService.showErrorMessage("Something went wrong");
      this.onClose();
    }));
    this.subscription.add(this.dataStorageService.fetchTags().subscribe((resData)=>{},(error)=>{
      this.snackbarService.showErrorMessage("Something went wrong");
      this.onClose();
    }));
    this.subscription.add(
      this.dataStorageService.fetchBoard().subscribe(({ data }) => {
        // We need to reinitialize form because of the bug
        // causing Form to not be initialized on reload of the page "/board/id"
        this.initForm();
      })
    );
  }

  private subscribeToChanges() {
    this.subscription.add(
      this.boardService.usersChanged.subscribe((users: any) => {
        this.users = users;
      })
    );

    this.subscription.add(
      this.boardService.tagsChanged.subscribe((tags: any) => {
        this.tags = tags;
      })
    );

    this.subscription.add(
      this.boardService.boardChanged.subscribe((tasks: any) => {
        this.tasks = tasks;
      })
    );
  }

  private initForm() {
    if (this.editMode && this.id) {
      const task = this.boardService.getTask(this.id);

      this.myForm = this.formBuilder.group({
        name: [task?.name, Validators.required],
        description: [task?.description, Validators.required],
        tags: [task?.tags],
        assignee: [task?.assignee, Validators.required],
        blockedBy: [task?.blockedBy],
        id: [task?.id],
        status: [task?.status],
      });
    } else {
      this.myForm = this.formBuilder.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        tags: [[]],
        assignee: ['', Validators.required],
        blockedBy: [[]],
        id: [],
        status: [[]],
      });
    }
  }

  submitForm() {
    if (this.myForm.valid) {
      if (this.editMode) {
        this.dataStorageService
          .updateTask(this.myForm.value)
          .subscribe(({ data }) => {
            this.boardService.updateTask(data);
            this.onClose();
            this.snackbarService.showSuccessMessage("Task updated successfully");
          },(error)=>{
            this.snackbarService.showErrorMessage("Something went wrong");
            this.onClose();
          });
      } else {
        // When creating new Task Id property should not be in object
        delete this.myForm.value.id;

        this.dataStorageService
          .createTask(this.myForm.value)
          .subscribe(({ data }) => {
            this.boardService.setTask(data);
            this.onClose();
            this.snackbarService.showSuccessMessage("Task created successfully");
          }, (error)=>{
            this.snackbarService.showErrorMessage("Something went wrong");
            this.onClose();
          });
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
