import { ElementRef, Injectable, QueryList } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable, pipe } from 'rxjs';
import { Ticket } from '../models/Ticket.class';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  tickets!: Observable<any>;
  count!: number;
  tickets2!: any;
  sort = {
    ref: 'id',
    dir: 'desc'
  };

  constructor(private firestore: AngularFirestore) {}

  getTickets() {
/*     this.tickets = this.firestore
      .collection('tickets')
      .valueChanges()
      .pipe(map((values) => values.sort((a: any, b: any) => b.id - a.id))); */
    this.tickets = this.firestore
      .collection('tickets', (ref) => ref.orderBy(this.sort.ref, 'desc'))
      .valueChanges();
  }

  setSortRef(ref: string, dir: string){
    this.sort.ref = ref;
    this.sort.dir = dir;
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
