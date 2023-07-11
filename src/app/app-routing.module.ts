import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { BoardRoutingModule } from './board/board-routing.module';

const routes: Routes = [
  { path: '', redirectTo: '/board', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  { path: '**', redirectTo: '/board' },
];

@NgModule({
  imports: [BoardRoutingModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
