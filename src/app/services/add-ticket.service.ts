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
  deadline: string = '';

  constructor(private fireService: FirestoreService) {}

  addTicket(columnId: string) {
    this.action = 'add';
    if (this.fireService.currentBoard)
      this.ticket = new Ticket(columnId, this.fireService.currentBoard.id);
    this.isAddingTicket = true;
  }

  editTicket(ticketId: string) {
    this.action = 'edit';
    this.isAddingTicket = true;
    const ticketRef = this.fireService.getFilteredCollection(
      'tickets',
      'id',
      '==',
      ticketId
    );
    ticketRef.subscribe((doc: any) => {
      this.ticket = doc[0];
    });
  }

  saveTicket() {
    this.isSavingTicket = true;
    this.setTicketData();
    this.fireService.addDoc('tickets', this.ticket.id, this.ticket).then(() => {
      this.closeModal();
      this.isSavingTicket = false;
    });
  }

  setTicketData() {
    if (this.action === 'add') {
      const date = new Date();
      this.ticket.date =
        date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
      this.ticket.id = date.getTime().toString();
    }
    this.ticket.title_transf = this.ticket.title.toLowerCase();
    this.ticket.description_transf = this.ticket.description.toLowerCase();
  }

  closeModal() {
    this.isAddingTicket = false;
  }
}
