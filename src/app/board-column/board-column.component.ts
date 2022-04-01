import {
  Component,
  OnInit,
  Input,
} from '@angular/core';
import { AddTicketService } from '../services/add-ticket.service';
import { DragNdropService } from '../services/drag-ndrop.service';
import { FirestoreService } from '../services/firestore.service';
import { Column } from '../models/Column.class';
import { Observable } from 'rxjs';

export interface columnData {
  index: number;
  column: any;
}

@Component({
  selector: 'app-board-column',
  templateUrl: './board-column.component.html',
  styleUrls: ['./board-column.component.scss'],
})
export class BoardColumnComponent implements OnInit {
  dragOver = false;
  childrenDisabled = false;
  @Input('column') column!: Column;
  @Input('index') index!: number;
  tickets!: Observable<any>;
  dragCopy!: Node;

  constructor(
    public fireService: FirestoreService,
    public addticket: AddTicketService,
    public dragService: DragNdropService
  ) {}

  ngOnInit(): void {
    this.tickets = this.fireService.loadTickets(this.column.id);
  }

  onDragstart(event: any) {
    this.dragService.dragColumn(event, this.column, this.index);
    this.dragService.toggleInputs(true);
    this.copyElem(event);
  }

  onDragover(event: any) {
    if (
      (this.childrenDisabled &&
        event.target ==
          this.dragService.columns.toArray()[this.dragService.indexCol2]
            .nativeElement.firstChild) ||
      !this.childrenDisabled
    ) {
      this.dragService.allowDrop(event);
      this.highlightColumn(true);
      if (!this.dragService.dragData.ticket) {
        this.dragService.startColumnAnim(this.index, event);
        this.childrenDisabled = true;
      }
    }
  }

  onDragleave(event: any) {
    this.dragOver = false;
    if (!this.dragService.dragData.ticket) {
      this.dragService.resetStylesPerCol(this.index, event);
      setTimeout(() => {
        this.childrenDisabled = false;
      }, 500);
    }
  }

  onDragend(event: any) {
    this.dragService.toggleInputs(false);
    this.dragService.resetDragColumn(event);
  }

  onDrop() {
    this.dragService.dropElement(this.column);
    this.dragOver = false;
    document.body.removeChild(this.dragCopy)
    document.body.style.overflowY='';
  }

  highlightColumn(status: boolean) {
    if (this.dragColNotDropCol()) {
      this.dragOver = status;
    }
  }

  dragColNotDropCol() {
    return (
      (this.dragService.dragData.col1_id &&
        this.column.id != this.dragService.dragData.col1_id) ||
      (this.dragService.dragData.col1 &&
        this.column.id != this.dragService.dragData.col1.id)
    );
  }

  copyElem(event: any) {
    this.dragCopy = event.target.firstChild.cloneNode(true);
    document.body.style.overflowY='hidden';
    document.body.appendChild(this.dragCopy);
    event.dataTransfer.setDragImage(this.dragCopy, 50, 50);
    event.target.firstChild.style.opacity = '0';
  }
}
