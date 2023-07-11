import { NgModule } from '@angular/core';
import { BoardComponent } from './board.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';

import {
  CdkDragPlaceholder,
  CdkDropList,
  CdkDrag,
} from '@angular/cdk/drag-drop';
import { AddNewTaskComponent } from './add-new-task/add-new-task.component';

@NgModule({
  declarations: [BoardComponent, AddNewTaskComponent],
  imports: [
    CommonModule,
    RouterModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    CdkDragPlaceholder,
    CdkDropList,
    CdkDrag,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatOptionModule,
    MatSelectModule,
    MatCardModule,
    MatCheckboxModule,
  ],
  exports: [BoardComponent],
})
export class BoardModule {}
