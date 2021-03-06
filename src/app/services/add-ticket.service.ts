import { Injectable } from '@angular/core';
import { Ticket } from '../models/Ticket.class';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class AddTicketService {
  isAddingTicket = false;
  isSavingTicket = false;
  ticket!: Ticket;
  action!: string;
  deadline: string = '';

  constructor(private fireService: FirestoreService) {}

  addTicket(columnId: string) {
    this.action = 'add';
    if (this.fireService.currentBoard)
      this.ticket = new Ticket(columnId, this.fireService.currentBoard.id);
    this.isAddingTicket = true;
  }

  async editTicket(ticketId: string) {
    this.action = 'edit';
    this.isAddingTicket = true;
    this.fireService
      .getFilteredCollection('tickets', 'id', '==', ticketId)
      .subscribe(async (doc: any) => {
        this.ticket = await doc[0];
        console.log(this.ticket);
      });
  }

  async saveTicket(categoryNumber: number) {
    this.isSavingTicket = true;
    this.setTicketData(categoryNumber);
    if (this.action == 'add') {
      await this.fireService.addDoc('tickets', this.ticket);
    } else {
      await this.fireService.setDoc('tickets', this.ticket, this.ticket.id);
    }
    this.closeModal();
    this.isSavingTicket = false;
  }

  setTicketData(categoryNumber: number) {
    if (this.action === 'add') {
      const date = new Date();
      this.ticket.date =
        date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    }
    this.ticket.category = categoryNumber;
    this.ticket.title_transf = this.ticket.title.toLowerCase();
    this.ticket.description_transf = this.ticket.description.toLowerCase();
  }

  closeModal() {
    this.isAddingTicket = false;
  }
}
