import { AfterViewInit, Component, ElementRef, OnChanges, OnInit, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
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
  @ViewChildren('ticket') tickets!: QueryList<ElementRef>;

  constructor(public fireService: FirestoreService) {}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.fireService.countTickets(this.tickets);
    this.tickets.changes.subscribe(() => this.fireService.countTickets(this.tickets))
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.fireService.countTickets(this.tickets);
  }

  showTicket(i: number) {
    this.descriptionElem.toArray()[i].nativeElement.classList.toggle('h-0');
    setTimeout(() => {
      this.descriptionTextElem.toArray()[i].nativeElement.classList.toggle('d-none');
    }, 100);
  }
}
