import * as FromApp from '../../store/app.reducer';

export const selectAuthUser = (state: FromApp.AppState) => state.auth.user;
