import { Injectable } from '@angular/core';
import { Ticket } from '../models/Ticket.class';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class AddTicketService {
  isAddingTicket = false;
  isSavingTicket = false;
  ticket!: Ticket;

  constructor(private fireService: FirestoreService) { }

  addTicket(id: string){
    this.ticket = new Ticket();
    this.isAddingTicket = true;
    this.fireService.addTicketColumn = id;
  }

  saveTicket() {
    this.isSavingTicket = true;
    this.ticket.date = new Date()
    this.ticket.id = this.ticket.date.getTime().toString();
    this.ticket.title_transf = this.ticket.title.toLowerCase()
    this.ticket.description_transf = this.ticket.description.toLowerCase()
    this.fireService.addTicket(this.ticket)
    .then(() => {
      this.closeModal();
      this.isSavingTicket = false;
      });
  }

  closeModal(){
    this.isAddingTicket = false;
  }
}
