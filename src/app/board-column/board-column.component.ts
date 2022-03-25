import {
  Component,
  OnInit,
  HostListener,
  Input,
  ViewChild,
  ElementRef,
  ViewChildren,
} from '@angular/core';
import { TitleComponent } from '../title/title.component';
import { AddTicketService } from '../services/add-ticket.service';
import { DragNdropService } from '../services/drag-ndrop.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-board-column',
  templateUrl: './board-column.component.html',
  styleUrls: ['./board-column.component.scss'],
})
export class BoardColumnComponent implements OnInit {
  dragOver = false;
  @Input('column') column: any;
  @ViewChildren(TitleComponent) titles!: TitleComponent;

  constructor(
    public fireService: FirestoreService,
    public addticket: AddTicketService,
    public dragService: DragNdropService
  ) {}

  ngOnInit(): void {}

  highlightColumn(status: boolean) {
    if (this.column.id != this.dragService.dragData.col1.id) {
      this.dragOver = status;
    }
  }
}
