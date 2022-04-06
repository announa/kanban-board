import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Observable } from 'rxjs';
import { AddTicketService } from '../services/add-ticket.service';
import { DragNdropService } from '../services/drag-ndrop.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
})
export class TicketComponent implements OnInit, OnChanges, AfterViewInit {
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
  isVisible = false;

  constructor(
    public fireService: FirestoreService,
    public dragService: DragNdropService,
    private addTicketServ: AddTicketService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    /*     this.fireService.countTickets(this.tickets);
    this.tickets.changes.subscribe(() => this.fireService.countTickets(this.tickets)) */
  }

  ngOnChanges(changes: SimpleChanges): void {
    /*     this.fireService.countTickets(this.tickets); */
  }

  /* showTicket(i: number) { */
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

  moveToBoard(){
    this.fireService.moveTicketToBoard(this.ticket.id)
  }
}
