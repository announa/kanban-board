import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Ticket } from '../models/Ticket.class';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  tickets!: Observable<any>;


  constructor(private firestore: AngularFirestore) {
   }

   getTickets(){
    this.tickets = this.firestore.collection('tickets').valueChanges()
   }

   addTicket(ticket: Ticket){
    return this.firestore
    .collection('tickets')
    .doc('ticket').set({...ticket});
   }
}
