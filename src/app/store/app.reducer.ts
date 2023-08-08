import { ActionReducerMap } from '@ngrx/store';

import * as fromBoard from '../board/store/board.reducer';
import * as fromAuth from '../auth/store/auth.reducer';

export interface AppState {
  auth: fromAuth.State;
  board: fromBoard.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  board: fromBoard.boardReducer,
};
