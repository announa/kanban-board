import { ElementRef, Injectable, QueryList, ViewChildren } from '@angular/core';
import { Column } from '../models/Column.class';
import { Ticket } from '../models/Ticket.class';
import { FirestoreService } from './firestore.service';

export class DragData {
  ticket: string | undefined;
  col1_id!: string | undefined;
  col1!: Column | undefined;
  col1_index: number | undefined;
}
@Injectable({
  providedIn: 'root',
})
export class DragNdropService {
  dragData = new DragData();
  dropData: any;
  isDragging = false;
  colArr!: ElementRef[];
  columns!: QueryList<ElementRef>;
  colArrDragData: any;
  colArrDropData: any;

  constructor(private fireService: FirestoreService) {}

  dragTicket(event: any, ticket: Ticket) {
    event.stopPropagation();
    this.isDragging = true;
    this.dragData.col1_id = ticket.columnId;
    this.dragData.ticket = ticket.id;
    this.dragData.col1 = undefined;
    this.dragData.col1_index = undefined;
  }

  dragColumn(event: any, column: Column, index: number) {
    event.stopPropagation();
    this.isDragging = true;
    this.dragData.col1 = column;
    this.dragData.ticket = undefined;
    this.dragData.col1_id = undefined;
    this.dragData.col1_index = index;
    console.log(this.dragData.col1_index);
  }

  /*   dragElem(event: any, column: any, ticket?: any) {
    event.stopPropagation();
    this.isDragging = true;
    if (event.target.classList.contains('column-title')) {
      this.dragData.col1 = column;
    } else {
      this.dragData.col1 = column;
      this.dragData.ticket = ticket ? ticket : undefined;
    }
  } */

  toggleInputs(status: boolean) {
    this.isDragging = status;
  }

  dropElement(col2: Column) {
    if (this.dragData.ticket) {
      if (col2.id != this.dragData.col1_id) {
        this.fireService.moveTicket(
          this.dragData.ticket,
          this.dragData.col1,
          col2.id
        );
      }
    } else if (this.dragData.col1 && col2.id != this.dragData.col1.id) {
      this.swithColumnAnim();
      setTimeout(() => {
        this.switchColumns(col2);
      }, 250);
    }
  }

  allowDrop(event: any) {
    event.preventDefault();
  }

  startColumnAnim(columnData: any) {
    this.dropData = columnData;
    if (this.dragData.col1) {
      if (this.dragData.col1_index && columnData < this.dragData.col1_index) {
        this.moveColRight();
      }
    }
  }

  moveColRight() {
    if (this.dragData.col1_index)
      this.colArrDragData =
        this.columns.toArray()[
          this.dragData.col1_index
        ].nativeElement.firstChild.firstChild;

    this.colArrDropData =
      this.columns.toArray()[this.dropData].nativeElement.firstChild.firstChild;

    this.colArrDropData.classList.add('drag-animation-right');
  }

  swithColumnAnim() {
    const left = this.colArrDropData.offsetLeft;
    this.colArrDropData.classList.add('switch-columns');
    this.colArrDragData.style.position = 'absolute';
    this.colArrDragData.style.left = left + 'px';
  }

  switchColumns(col2: Column) {
    this.fireService.moveColumn(this.dragData.col1, col2);
    this.resetStyles();
  }

  resetStyles() {
    this.colArrDragData.style.position = 'relative';
    this.colArrDragData.style.left = '';
    this.colArrDragData.classList.remove('switch-columns');
    this.colArrDragData.classList.remove('drag-animation-right');
  }
}
