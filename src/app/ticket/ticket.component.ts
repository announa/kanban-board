import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { AddTicketService } from '../services/add-ticket.service';
import { DragNdropService } from '../services/drag-ndrop.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
})
export class TicketComponent implements OnInit {
  @ViewChild('descriptionElem') descriptionElem!: ElementRef;
  @ViewChild('descriptionTextElem') descriptionTextElem!: ElementRef;
  @ViewChild('ticketElem') ticketElem!: ElementRef;
  @ViewChild('category') category!: ElementRef;
  @ViewChild('deadline') deadline!: ElementRef;
  @ViewChild('priority') priority!: ElementRef;
  @ViewChild('date') date!: ElementRef;
  @ViewChild('footer') footer!: ElementRef;
  @ViewChildren('icon') icon!: QueryList<ElementRef>;
  @Input('ticket') ticket!: any;
  @Input('column') column!: any;
  @HostListener('document:click', ['$event'])
  clickListener(event: any) {
    this.toggleMoveTicketMenu(event);
  }
  isVisible = false;
  showMoveTicketMenu = false;

  constructor(
    public fireService: FirestoreService,
    public dragService: DragNdropService,
    private addTicketServ: AddTicketService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  showTicket() {
    this.isVisible = !this.isVisible;
    [this.descriptionElem, this.footer].forEach((e) =>
      e.nativeElement.classList.toggle('h-0')
    );
    this.icon.forEach((i) => i.nativeElement.classList.toggle('h-0'));
    setTimeout(() => {
      [
        this.descriptionTextElem,
        this.category,
        this.deadline,
        this.priority,
        this.date,
      ].forEach((e) => e.nativeElement.classList.toggle('d-none'));
    }, 175);
  }

  editTicket() {
    this.addTicketServ.editTicket(this.ticket.id);
  }

  deleteTicket() {
    this.fireService.deleteDoc('tickets', this.ticket.id);
  }

  moveToBoard() {
    this.fireService.moveTicketToBoard(this.ticket.id);
    this.navigate();
  }

  navigate() {
    this.router.navigateByUrl('/board/' + this.fireService.currentBoardId);
  }

  getPriorityColor() {
    switch (this.ticket.priority) {
      case 'Low':
        return 'rgb(var(--priority-low))';
        break;

      case 'Middle':
        return 'rgb(var(--priority-middle))';
        break;

      case 'High':
        return 'rgb(var(--priority-high))';
        break;

      default:
        return 'transparent';
        break;
    }
  }

  toggleMoveTicketMenu(event: any) {
    event.stopPropagation();
    if (event.target.id != 'current-column') {
      if (
        event.target.id != 'move-ticket' &&
        event.target.id != 'move-ticket-icon'
      ) {
        this.showMoveTicketMenu = false;
      } else {
        this.showMoveTicketMenu = !this.showMoveTicketMenu;
      }
    }
  }

  moveToColumn(index: number) {
    console.log(this.ticket.id);
    console.log(this.fireService.columns[index].id);
    if (this.fireService.columns[index].id != this.ticket.columnId) {
      this.fireService.updateDoc(
        'tickets',
        this.ticket.id,
        {columnId: this.fireService.columns[index].id}
      );
    }
  }
}
