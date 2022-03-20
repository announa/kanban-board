import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Board } from '../models/Board.class';
import { Ticket } from '../models/Ticket.class';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-ticket-add',
  templateUrl: './ticket-add.component.html',
  styleUrls: ['./ticket-add.component.scss'],
})
export class TicketAddComponent implements OnInit {
  @Input() isAddingTicket: boolean = false;
  @Output() isAddingTicketChange = new EventEmitter();
  ticket = new Ticket();

  constructor(public fireService: FirestoreService) {}

  ngOnInit(): void {}
  closeModal() {
    this.isAddingTicketChange.emit(false);
  }

  addTicket() {
    this.ticket.date = new Date()
    this.ticket.id = this.ticket.date.getTime();
    this.ticket.title_transf = this.ticket.title.toLowerCase()
    this.ticket.description_transf = this.ticket.description.toLowerCase()
    this.fireService.addTicket(this.ticket)
      .then(() => {
        this.closeModal();
      });
  }
}
