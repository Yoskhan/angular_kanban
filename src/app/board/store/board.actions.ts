import { createAction, props } from '@ngrx/store';
import { Task } from '../tasks.model';
import { Tag } from '../tags.model';
import { User } from '../users.model';

export const setTasks = createAction(
  '[Board] Set Tasks',
  props<{ tasks: Task[] }>()
);

export const fetchTasks = createAction('[Board] Fetch Tasks');

export const fetchUsers = createAction('[Board] Fetch Users');

export const fetchTags = createAction('[Board] Fetch Tags');

export const fetchFailed = createAction('[Board] Fetch Failed');

export const setTags = createAction(
  '[Board] Set Tags',
  props<{ tags: Tag[] }>()
);

export const setUsers = createAction(
  '[Board] Set Users',
  props<{ users: User[] }>()
);

export const addTask = createAction(
  '[Board] Add Task',
  props<{ task: Task }>()
);

export const taskAdded = createAction(
  '[Board] Task Added',
  props<{ task: Task }>()
);

export const updateTask = createAction(
  '[Board] Update Task',
  props<{ task: Task }>()
);

export const taskUpdated = createAction(
  '[Board] Task Updated',
  props<{ task: Task }>()
);
