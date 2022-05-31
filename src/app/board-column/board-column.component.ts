import { Component, OnInit, Input } from '@angular/core';
import { AddTicketService } from '../services/add-ticket.service';
import { DragNdropService } from '../services/drag-ndrop.service';
import { FirestoreService } from '../services/firestore.service';
import { Column } from '../models/Column.class';
import { Observable } from 'rxjs';
import { Ticket } from '../models/Ticket.class';

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
  dragStart = false;
  @Input('column') column!: Column;
  @Input('index') index!: number;
  ticketsObservable!: Observable<unknown>;
  tickets!: Observable<Ticket[]>
  showTooltip = false;

  constructor(
    public fireService: FirestoreService,
    public addticket: AddTicketService,
    public dragService: DragNdropService
  ) {}

  async ngOnInit() {
    this.fireService.isProcessing = true;
    this.tickets = await this.fireService.loadTickets(this.column.id) as Observable<Ticket[]>
    this.fireService.isProcessing = false;
  }

  onDragstart(event: any) {
    this.dragService.dragColumn(event, this.column, this.index);
    this.dragService.toggleInputs(true);
    this.dragService.copyElem(event);
    this.highlightDrogColumn(true);
  }

  onDragover(event: any) {
    this.dragService.allowDrop(event);
    this.highlightDrogOverColumn(true);
    if (!this.dragService.dragData.ticket) {
      this.dragService.disableChildren(this.index);
      this.dragService.startColumnAnim(this.index, event);
    }
  }

  onDragleave(event: any) {
    this.dragOver = false;
    if (!this.dragService.dragData.ticket) {
      this.dragService.resetStylesPerCol(this.index, event);
      setTimeout(() => {
        this.dragService.enableChildren(this.index);
      }, 500);
    }
  }

  onDragend(event: any) {
    this.dragService.toggleInputs(false);
    this.dragService.resetDragColumn(event);
    this.dragService.removeCloneNode();
    this.highlightDrogColumn(false);
  }

  onDrop() {
    this.dragService.dropElement(this.column);
    this.dragOver = false;
    this.dragService.removeCloneNode();
    document.body.style.overflowY = '';
    this.dragService.enableChildren(this.index);
  }

  highlightDrogOverColumn(status: boolean) {
    if (this.dragColNotDropCol()) {
      this.dragOver = status;
    }
  }

  highlightDrogColumn(status: boolean) {
    this.dragStart = status;
  }

  dragColNotDropCol() {
    return (
      (this.dragService.dragData.col1_id &&
        this.column.id != this.dragService.dragData.col1_id) ||
      (this.dragService.dragData.col1 &&
        this.column.id != this.dragService.dragData.col1.id)
    );
  }

  toggleTooltip() {
    this.showTooltip = !this.showTooltip;
  }

  addNewTicket() {
    this.addticket.addTicket(this.column.id);
  }

  moveLeft() {
    if (this.index > 0) {
      this.fireService.moveColumn(
        this.column,
        this.fireService.columns[this.index - 1]
      );
    }
  }

  moveRight() {
    if (this.index < this.fireService.columns.length - 1) {
      this.fireService.moveColumn(
        this.column,
        this.fireService.columns[this.index + 1]
      );
    }
  }

  switchColumns(columsToSwitch: { col1: number; col2: number }) {
    const col1 = this.fireService.columns[columsToSwitch.col1];
    const col2 = this.fireService.columns[columsToSwitch.col2];
    this.fireService.moveColumn(col1, col2);
  }
}
