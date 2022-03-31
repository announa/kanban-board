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
    console.log(columnData);
    if (this.dragData.col1) {
      console.log('condition 1 true');
      console.log(this.dragData.col1.order);
      if (this.dragData.col1_index && columnData < this.dragData.col1_index) {
        console.log('condition 2 true');
        this.moveColRight();
      }
    }
  }

  moveColRight() {
    this.colArr = this.columns.toArray();
    this.colArr[
      this.dropData
    ].nativeElement.firstChild.firstChild.classList.add('drag-animation-right');
  }

  swithColumnAnim() {
    const left =
      this.colArr[this.dropData].nativeElement.firstChild.firstChild.offsetLeft;
    /* const compStyle = window.getComputedStyle(this.colArr[this.dropData].nativeElement.firstChild.firstChild)
    const left = compStyle.getPropertyValue('left') */
    this.colArr[
      this.dropData
    ].nativeElement.firstChild.firstChild.classList.add('switch-columns');
    if (this.dragData.col1_index) {
      this.colArr[
        this.dragData.col1_index
      ].nativeElement.firstChild.firstChild.style.position = 'absolute';
      this.colArr[
        this.dragData.col1_index
      ].nativeElement.firstChild.firstChild.style.left = left + 'px';
    }
  }

  switchColumns(col2: Column) {
    this.fireService.moveColumn(this.dragData.col1, col2);
    this.resetStyles();
  }

  resetStyles() {
    if (this.dragData.col1_index) {
      this.colArr[
        this.dragData.col1_index
      ].nativeElement.firstChild.firstChild.style.position = 'relative';
      this.colArr[
        this.dragData.col1_index
      ].nativeElement.firstChild.firstChild.style.left = '';
      this.colArr[
        this.dropData
      ].nativeElement.firstChild.firstChild.classList.remove('switch-columns');
      this.colArr[
        this.dropData
      ].nativeElement.firstChild.firstChild.classList.remove(
        'drag-animation-right'
      );
    }
  }
}
