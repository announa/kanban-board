import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class DragNdropService {
  dragData: any;

  constructor(private fireService: FirestoreService) {}

  dragTicket(ticket: any, column: any) {
    this.dragData = {
      ticket: ticket,
      col1: column,
    };
  }

  dropTicket(col2: any) {
    if (col2.id != this.dragData.col1.id) {
      this.fireService.moveTicket(
        this.dragData.ticket,
        this.dragData.col1,
        col2
      );
    }
  }

  allowDrop(event: any) {
    event.preventDefault();
  }
}
