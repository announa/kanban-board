import { Injectable } from '@angular/core';
import { Column } from '../models/Column.class';
import { Ticket } from '../models/Ticket.class';
import { FirestoreService } from './firestore.service';

export class DragData {
  ticket: string | undefined;
  col1_id!: string | undefined;
  col1!: Column | undefined;
}
@Injectable({
  providedIn: 'root',
})
export class DragNdropService {
  dragData = new DragData();
  isDragging = false;

  constructor(private fireService: FirestoreService) {}

  dragTicket(event: any, ticket: Ticket) {
    event.stopPropagation();
    this.isDragging = true;
    this.dragData.col1_id = ticket.columnId;
    this.dragData.ticket = ticket.id;
    this.dragData.col1 = undefined;
  }

  dragColumn(event: any, column: Column) {
    event.stopPropagation();
    this.isDragging = true;
    this.dragData.col1 = column;
    this.dragData.ticket = undefined;
    this.dragData.col1_id = undefined;
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
    } else if(this.dragData.col1 && col2.id != this.dragData.col1.id) {
      this.fireService.moveColumn(this.dragData.col1, col2);
    }
  }

  allowDrop(event: any) {
    event.preventDefault();
  }
}
