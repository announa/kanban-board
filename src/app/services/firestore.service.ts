import { ElementRef, Injectable, QueryList } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable, pipe } from 'rxjs';
import { Ticket } from '../models/Ticket.class';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  tickets!: Observable<any>;
  boards!: Observable<any>;
  currentBoardRef: string = 'board1';
  currentBoard!: any;
  columns!: Observable<any>;
  /* columns!: Observable<any>; */
  columns_data!: any;
  columns2!: any;
  count!: number;
  sort = {
    ref: 'id',
    dir: 'desc',
  };
  addTicketColumn!: string;

  constructor(private firestore: AngularFirestore) {}

  loadBoards() {
    this.boards = this.firestore.collection('boards').valueChanges();
    this.firestore
      .collection('boards')
      .doc(this.currentBoardRef)
      .valueChanges()
      .subscribe((board) => {
        this.currentBoard = board;
        this.loadColumns();
      });
  }

  loadColumns() {
    this.columns = this.firestore
      .collection('boards')
      .doc(this.currentBoardRef)
      .collection('columns')
      .valueChanges();
    /*     this.columns2 = this.firestore.collection('boards').doc(this.currentBoardRef).collection('columns').doc('columns1').valueChanges().subscribe( columns => {
      this.columns2 = columns
      console.log(this.columns2.title)
    }
    ) */
    this.columns_data = this.firestore
      .collection('boards')
      .doc(this.currentBoardRef)
      .collection('columns')
      .snapshotChanges()
      .pipe(
        map((columns) => {
          return columns.map((column) => {
            const data = column.payload.doc.data();
            const id = column.payload.doc.id;
            /*       const tickets = this.getTickets(id);
             */ return { id, ...data };
          });
        })
      );
    setTimeout(() => {
      console.log(this.columns_data);
    }, 1000);
  }

  getTickets(columnId: string) {
    return this.firestore
      .collection('boards')
      .doc(this.currentBoardRef)
      .collection('columns')
      .doc(columnId)
      .collection('tickets')
      .valueChanges();
  }

  loadTickets(columnId: string, ref?: string, dir?: string) {
    if (ref) this.sort.ref = ref;
    if (dir) this.sort.dir = dir;
    /*     this.tickets = this.firestore
      .collection('tickets')
      .valueChanges()
      .pipe(map((values) => values.sort((a: any, b: any) => b.id - a.id))); */
    return this.firestore
      .collection('boards')
      .doc(this.currentBoardRef)
      .collection('columns')
      .doc(columnId)
      .collection('tickets', this.ticketFilter.bind(this))
      .valueChanges();
    /*     this.tickets = this.firestore
      .collection('tickets', (ref) => ref.orderBy(this.sort.ref, 'desc'))
      .valueChanges(); */
  }

  ticketFilter(ref: any) {
    return this.sort.dir == 'desc'
      ? ref.orderBy(this.sort.ref, 'desc')
      : ref.orderBy(this.sort.ref, 'asc');
  }

  setSortRef(ref: string, dir: string) {
    this.sort.ref = ref;
    this.sort.dir = dir;
  }

  addTicket(ticket: Ticket) {
    /*     return this.firestore
      .collection('tickets')
      .doc('ticket' + this.count)
      .set({ ...ticket }); */
    return this.firestore
      .collection('boards')
      .doc(this.currentBoardRef)
      .collection('columns')
      .doc(this.addTicketColumn)
      .collection('tickets')
      .doc('ticket' + this.count)
      .set({ ...ticket });
  }

  countTickets(tickets: QueryList<ElementRef>) {
    this.count = tickets.toArray().length;
  }
}
