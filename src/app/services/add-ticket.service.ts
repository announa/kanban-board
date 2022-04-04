import { Injectable } from '@angular/core';
import { Ticket } from '../models/Ticket.class';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class AddTicketService {
  isAddingTicket = false;
  isSavingTicket = false;
  ticket!: any;
  action!: string;

  constructor(private fireService: FirestoreService) {}

  addTicket(columnId: string) {
    this.action = 'add';
    this.ticket = new Ticket(columnId);
    this.isAddingTicket = true;

    /*     this.fireService.addTicketColumn = columnId; */
  }

  editTicket(ticketId: string) {
    this.action = 'edit';
    this.isAddingTicket = true;
    const ticketRef = this.fireService.getTicket(ticketId);
    ticketRef.subscribe((doc) => {
      this.ticket = doc[0];
      console.log(this.ticket);
    });
  }

  saveTicket() {
    this.isSavingTicket = true;
    this.setTicketData();
    this.fireService.addTicket(this.ticket).then(() => {
      this.closeModal();
      this.isSavingTicket = false;
    });
  }

  setTicketData() {
    if (this.action === 'add') {
      this.ticket.date = new Date();
      this.ticket.id = this.ticket.date.getTime().toString();
    }
    this.ticket.title_transf = this.ticket.title.toLowerCase();
    this.ticket.description_transf = this.ticket.description.toLowerCase();
  }

  closeModal() {
    this.isAddingTicket = false;
  }
}
