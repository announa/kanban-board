import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
})
export class TicketComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChildren('descriptionElem') descriptionElem!: QueryList<ElementRef>;
  @ViewChildren('descriptionTextElem') descriptionTextElem!: QueryList<ElementRef>;
  @ViewChildren('ticketElem') ticketsElem!: QueryList<ElementRef>;
  @ViewChildren('footer') footer!: QueryList<ElementRef>;
  @ViewChildren('icon') icon!: QueryList<ElementRef>;
  @Input('column') column!: any;

  constructor(public fireService: FirestoreService) {}

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
/*     this.fireService.countTickets(this.tickets);
    this.tickets.changes.subscribe(() => this.fireService.countTickets(this.tickets)) */
  }
  
  ngOnChanges(changes: SimpleChanges): void {
/*     this.fireService.countTickets(this.tickets); */
  }

  /* showTicket(i: number) { */
  showTicket(i: number) {
    [this.descriptionElem, this.footer, this.icon].forEach(e => e.toArray()[i].nativeElement.classList.toggle('h-0'));
    setTimeout(() => {
      this.descriptionTextElem.toArray()[i].nativeElement.classList.toggle('d-none');
    }, 150);
  }
}
