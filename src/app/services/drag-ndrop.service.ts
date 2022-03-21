import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';

export class DragData {
  ticket: any;
  col1: any;
}
@Injectable({
  providedIn: 'root',
})
export class DragNdropService {
  dragData = new DragData();
  isDragging = false;

  constructor(private fireService: FirestoreService) {}

  dragElem(event: any, column: any, ticket?: any) {
    event.stopPropagation();
    this.isDragging = true;
    if(event.target.classList.contains('column-title')){
      this.dragData.col1 = column;
    } else{
      this.dragData.col1 = column;
      this.dragData.ticket = ticket ? ticket : undefined;
    }
  }
    
  toggleInputs(status: boolean){
    this.isDragging = status;
    }

  dropElement(col2: any) {
    if (col2.id != this.dragData.col1.id) {
      if (this.dragData.ticket) {
        this.fireService.moveTicket(
          this.dragData.ticket,
          this.dragData.col1,
          col2
        );
      } else {
        this.fireService.moveColumn(this.dragData.col1, col2);
      }
    }
  }

  allowDrop(event: any) {
    event.preventDefault();
  }
}
