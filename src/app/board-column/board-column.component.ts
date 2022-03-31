import {
  Component,
  OnInit,
  HostListener,
  Input,
  ViewChild,
  ElementRef,
  ViewChildren,
  QueryList,
  Output,
  EventEmitter,
} from '@angular/core';
import { TitleComponent } from '../title/title.component';
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
  @Input('column') column!: Column;
  @Input('index') index!: number;
  @Output() triggerAnim = new EventEmitter<number>();
  /* @ViewChildren(TitleComponent) titles!: TitleComponent; */
  tickets!: Observable<any>;

  constructor(
    public fireService: FirestoreService,
    public addticket: AddTicketService,
    public dragService: DragNdropService
  ) {}

  ngOnInit(): void {
    this.tickets = this.fireService.loadTickets(this.column.id);
  }

  onDragOver(event: any) {
    this.dragService.allowDrop(event);
  }

  highlightColumn(status: boolean) {
    if (
      (this.dragService.dragData.col1_id &&
        this.column.id != this.dragService.dragData.col1_id) ||
      (this.dragService.dragData.col1 &&
        this.column.id != this.dragService.dragData.col1.id)
    ) {
      this.dragOver = status;
    }
  }

  triggerColumnAnim() {
    if (this.dragService.dragData.ticket) this.highlightColumn(true);
    else this.triggerAnim.emit(this.index);
    /* else this.triggerAnim.emit({ index: this.index, column: this }); */
  }
}
