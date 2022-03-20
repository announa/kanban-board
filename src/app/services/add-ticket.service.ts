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
    console.log(typeof id)
    this.fireService.addTicketColumn = id;
  }

  saveTicket() {
    this.isSavingTicket = true;
    console.log(this.isSavingTicket)
    this.ticket.date = new Date()
    this.ticket.id = this.ticket.date.getTime().toString();
    this.ticket.title_transf = this.ticket.title.toLowerCase()
    this.ticket.description_transf = this.ticket.description.toLowerCase()
    this.fireService.addTicket(this.ticket)
    .then(() => {
      this.closeModal();
      this.isSavingTicket = false;
      console.log(this.isSavingTicket)
      });
  }

  closeModal(){
    this.isAddingTicket = false;
  }
}
