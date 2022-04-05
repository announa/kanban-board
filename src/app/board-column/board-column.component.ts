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
  dragStart = false;
  @Input('column') column!: Column;
  @Input('index') index!: number;
  tickets!: Observable<any>;
  showTooltip = false;

  constructor(
    public fireService: FirestoreService,
    public addticket: AddTicketService,
    public dragService: DragNdropService
  ) {}

  ngOnInit(): void {
    this.tickets = this.fireService.loadTickets(this.column.id);
  }

  onDragstart(event: any) {
    if(!this.dragService.isEditingTitle){
    this.dragService.dragColumn(event, this.column, this.index);
    this.dragService.toggleInputs(true);
    this.dragService.copyElem(event);
    this.highlightDrogColumn(true);
    }
  }
  
  onDragover(event: any) {
      this.dragService.allowDrop(event);
      this.highlightDrogOverColumn(true);
      if (!this.dragService.dragData.ticket) {
        this.dragService.disableChildren(this.index)
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
      console.log('dragend')
      this.dragService.toggleInputs(false);
      this.dragService.resetDragColumn(event);
      this.highlightDrogColumn(false);
    }
    
    onDrop() {
      this.dragService.dropElement(this.column);
      this.dragOver = false;
      this.dragService.removeCloneNode()
      document.body.style.overflowY='';
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

  toggleTooltip(){
    this.showTooltip = !this.showTooltip
  }
}
