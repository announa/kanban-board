import { ElementRef, Injectable, QueryList, ViewChildren } from '@angular/core';
import { Column } from '../models/Column.class';
import { Ticket } from '../models/Ticket.class';
import { FirestoreService } from './firestore.service';

export class DragData {
  ticket: string | undefined;
  col1_id!: string;
  col1!: Column;
  col1_index!: number;
}
@Injectable({
  providedIn: 'root',
})
export class DragNdropService {
  dragData = new DragData();
  indexCol2!: number;
  isDragging = false;
  colArr!: ElementRef[];
  columns!: QueryList<ElementRef>;
  draggedColumn: any;
  dropColumn: any;
  dropColumnArr: any;
  dragCopy!: any;
  dragStart!: number;
  isEditingTitle = false;

  constructor(private fireService: FirestoreService) {}

  dragTicket(event: any, ticket: Ticket) {
    event.stopPropagation();
    this.isDragging = true;
    this.dragData.col1_id = ticket.columnId;
    this.dragData.ticket = ticket.id;
  }

  dragColumn(event: any, column: Column, index: number) {
    event.stopPropagation();
    this.isDragging = true;
    this.dragData.col1 = column;
    this.dragData.ticket = undefined;
    this.dragData.col1_index = index;
  }

  toggleInputs(status: boolean) {
    this.isDragging = status;
  }

  // copy the column to be dragged and hide the original column
  copyElem(event: any) {
    this.dragCopy = event.target.firstChild.cloneNode(true);
    document.body.style.overflowY = 'hidden';
    document.body.appendChild(this.dragCopy);
    event.dataTransfer.setDragImage(this.dragCopy, 250, 100);
    event.target.firstChild.style.opacity = '0';
  }

  removeCloneNode() {
    if (this.dragCopy) {
      document.body.removeChild(this.dragCopy);
      this.dragCopy = null;
    }
  }

  dropElement(col2: Column) {
    if (this.dragData.ticket) {
      if (col2.id != this.dragData.col1_id) {
        this.fireService.updateDoc('tickets', this.dragData.ticket, {
          columnId: col2.id,
        });
      }
    } else if (this.dragData.col1 && col2.id != this.dragData.col1.id) {
      this.switchColumnsInDB(col2);
    }
  }

  allowDrop(event: any) {
    event.preventDefault();
  }

  disableChildren(indexCol2: number) {
    this.columns
      .toArray()
      [indexCol2].nativeElement.firstChild.querySelectorAll('*')
      .forEach((e: any) => {
        e.classList.add('events-disabled');
      });
  }

  startColumnAnim(indexCol2: number, event: any) {
    this.indexCol2 = indexCol2;
    if (
      (this.isDragging &&
        event.target ==
          this.columns.toArray()[indexCol2].nativeElement.firstChild) ||
      !this.isDragging
    )
      this.draggedColumn =
        this.columns.toArray()[
          this.dragData.col1_index
        ].nativeElement.firstChild.firstChild;
    this.dragStart = Date.now();
    if (indexCol2 < this.dragData.col1_index) {
      this.moveColRight();
    } else if (indexCol2 > this.dragData.col1_index) {
      this.moveColLeft();
    }
  }

  moveColRight() {
    for (let i = this.indexCol2; i < this.dragData.col1_index; i++) {
      this.setColAnimation(i, 'drag-animation-right');
    }
  }

  setColAnimation(i: number, animationName: string) {
    this.columns
      .toArray()
      [i].nativeElement.firstChild.firstChild.classList.add(animationName);
  }

  moveColLeft() {
    for (let i = this.indexCol2; i > this.dragData.col1_index; i--) {
      this.setColAnimation(i, 'drag-animation-left');
    }
  }

  switchColumnsInDB(col2: Column) {
    this.fireService.moveColumn(this.dragData.col1, col2);
  }

  resetDragColumn(event: any) {
    setTimeout(() => {
      event.target.firstChild.style.opacity = '';
    }, 250);
  }

  resetStylesPerCol(i: number, event?: any) {
    if ((event && this.targetIsDropCol(event)) || !event) {
      const dropCol =
        this.columns.toArray()[i].nativeElement.firstChild.firstChild;
      dropCol.classList.remove('drag-animation-left');
      dropCol.classList.remove('drag-animation-right');
    }
  }

  enableChildren(i: number) {
    this.columns
      .toArray()
      [i].nativeElement.firstChild.querySelectorAll('*')
      .forEach((e: any) => {
        e.classList.remove('events-disabled');
      });
  }

  targetIsDropCol(event: any) {
    return (
      event.target ==
      this.columns.toArray()[this.indexCol2].nativeElement.firstChild
    );
  }
}
