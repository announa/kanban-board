import { ElementRef, Injectable, QueryList } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { Ticket } from '../models/Ticket.class';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  tickets!: Observable<any>;
  count!: number;
  tickets2!: any;

  constructor(private firestore: AngularFirestore) {}

  getTickets() {
    this.tickets = this.firestore
      .collection('tickets')
      .valueChanges()
      .pipe(map((values) => values.sort((a: any, b: any) => b.id - a.id)));
    this.tickets2 = this.firestore.collection('tickets', (ref) =>
      ref.orderBy('id', 'desc')
    );
    console.log(this.tickets2);
  }

  addTicket(ticket: Ticket) {
    return this.firestore
      .collection('tickets')
      .doc('ticket' + this.count)
      .set({ ...ticket });
  }

  countTickets(tickets: QueryList<ElementRef>) {
    this.count = tickets.toArray().length;
  }
}
