import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Task } from '../tasks.model';
import * as FromApp from '../../store/app.reducer';
import * as FromBoard from '../store/board.reducer';

export const selectTasks = (state: FromApp.AppState) => state.board.tasks;
export const selectUsers = (state: FromApp.AppState) => state.board.users;
export const selectTags = (state: FromApp.AppState) => state.board.tags;
export const selectBoardIsLoading = (state: FromApp.AppState) => state.board.boardIsLoading;


export const selectTaskById = (itemId: number) =>
  createSelector(
    createFeatureSelector<FromBoard.State>('board'),
    (boardState: FromBoard.State) => {
      return boardState.tasks.find((item: Task) => item.id === itemId);
    }
  );
