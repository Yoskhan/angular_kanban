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
import { User } from '../users.model';
import { Tag } from '../tags.model';
import { Task } from '../tasks.model';
import { Subscription } from 'rxjs';

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
  private subscription: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private dataStorageService: DataStorageService,
    private boardService: BoardService
  ) {}

  ngOnInit() {
    this.loadData();
    this.subscribeToChanges();
    this.initForm();
  }

  private loadData() {
    this.subscription.add(this.dataStorageService.fetchUsers().subscribe());
    this.subscription.add(this.dataStorageService.fetchTags().subscribe());
    this.subscription.add(this.dataStorageService.fetchBoard().subscribe());
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
    this.myForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      tags: [[]],
      assignee: ['', Validators.required],
      blockedBy: [[]],
    });
  }

  submitForm() {
    if (this.myForm.valid) {
      this.dataStorageService
        .createTask(this.myForm.value)
        .subscribe(({ data }) => {
          this.tasks.push(data);
          this.boardService.boardChanged.next([...this.tasks]);
          this.onClose();
        });
    } else {
      // Form is invalid, show error messages
      this.myForm.markAllAsTouched();
    }
  }

  onClose() {
    this.close.emit();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
