import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
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
  @ViewChild('ticketElem') ticketsElem!: ElementRef;
  @ViewChild('footer') footer!: ElementRef;
  @ViewChild('icon') icon!: ElementRef;
  @Input('ticket') ticket!: any;
  @Input('column') column!: any;

  constructor(public fireService: FirestoreService, public dragService: DragNdropService) {}

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
  showTicket() {
    [this.descriptionElem, this.footer, this.icon].forEach(e => e.nativeElement.classList.toggle('h-0'));
    setTimeout(() => {
      this.descriptionTextElem.nativeElement.classList.toggle('d-none');
    }, 150);
  }


}
