//TODO create separate routing module for board path
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './board.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../auth/auth.guard';
import { AddNewTaskComponent } from './add-new-task/add-new-task.component';

const routes: Routes = [
  {
    path: 'board',
    component: BoardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'create-new', component: AddNewTaskComponent },
      { path: ':id', component: AddNewTaskComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoardRoutingModule {}
