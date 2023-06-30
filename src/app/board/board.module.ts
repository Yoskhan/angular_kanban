import { NgModule } from '@angular/core';
import { BoardComponent } from './board.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  CdkDragPlaceholder,
  CdkDropList,
  CdkDrag,
} from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [BoardComponent],
  imports: [
    CommonModule,
    RouterModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    CdkDragPlaceholder,
    CdkDropList,
    CdkDrag,
  ],
  exports: [BoardComponent],
})
export class BoardModule {}
