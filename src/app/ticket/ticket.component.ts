import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
})
export class TicketComponent implements OnInit {
  @ViewChildren('descriptionElem') descriptionElem!: QueryList<ElementRef>;
  @ViewChildren('descriptionTextElem') descriptionTextElem!: QueryList<ElementRef>;

  constructor(public fireService: FirestoreService) {}

  ngOnInit(): void {
  }

  showTicket(i: number) {
    this.descriptionElem.toArray()[i].nativeElement.classList.toggle('h-0');
    setTimeout(() => {
      this.descriptionTextElem.toArray()[i].nativeElement.classList.toggle('d-none');
    }, 100);
  }
}
