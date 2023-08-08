import { createReducer, on } from '@ngrx/store';
import { Tag } from '../tags.model';
import { Task } from '../tasks.model';
import { User } from '../users.model';
import * as BoardActions from './board.actions';

export interface State {
  tasks: Task[];
  tags: Tag[];
  users: User[];
  boardIsLoading: boolean;
}

const initialState: State = {
  tasks: [],
  tags: [],
  users: [],
  boardIsLoading: true,
};

export const boardReducer = createReducer(
  initialState,
  on(BoardActions.fetchTasks, (state, action) => {
    return { ...state, boardIsLoading: true };
  }),
  on(BoardActions.setTasks, (state, action) => {
    return { ...state, tasks: [...action.tasks], boardIsLoading: false };
  }),
  on(BoardActions.fetchFailed, (state, action) => {
    return { ...state, boardIsLoading: false };
  }),
  on(BoardActions.setTags, (state, action) => {
    return { ...state, tags: [...action.tags] };
  }),
  on(BoardActions.setUsers, (state, action) => {
    return { ...state, users: [...action.users] };
  }),
  on(BoardActions.taskAdded, (state, action) => {
    return { ...state, tasks: [...state.tasks, action.task] };
  }),
  on(BoardActions.taskUpdated, (state, action) => {
    const newTasks = state.tasks.map((task) => {
      return task.id === action.task.id ? action.task : task;
    });

    return { ...state, tasks: newTasks };
  })
);
