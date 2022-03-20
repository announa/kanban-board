import { ElementRef, Injectable, QueryList } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable, pipe } from 'rxjs';
import { Column } from '../models/Column.class';
import { Ticket } from '../models/Ticket.class';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  tickets!: Observable<any>;
  boards!: any;
  currentBoardRef: string = 'board1';
  currentBoard!: any;
  columns!: any;
  columns_data!: any;
  count!: number;
  sortCol = {
    ref: 'id',
    dir: 'desc',
  };
  sort = {
    ref: 'id',
    dir: 'desc',
  };
  currentTickets!: any;
  addTicketColumn!: string;

  constructor(private firestore: AngularFirestore) {}

  loadBoards() {
    this.boards = this.firestore.collection('boards');
    this.boards
      .doc(this.currentBoardRef)
      .valueChanges()
      .subscribe((board: any) => {
        this.currentBoard = board;
        this.loadColumns();
      });
  }

  loadColumns() {
    this.columns = this.firestore
      .collection('boards')
      .doc(this.currentBoardRef)
      .collection('columns');

    this.columns_data = this.firestore
      .collection('boards')
      .doc(this.currentBoardRef)
      .collection('columns', this.columnFilter.bind(this))
      .snapshotChanges()
      .pipe(
        map((columns: any) => {
          return columns.map((column: any) => {
            const data = column.payload.doc.data();
            const id = column.payload.doc.id;
            const tickets = this.getTickets(id);
            return { id, ...data, tickets };
          });
        })
      );
  }

  getTickets(columnId: string) {
    return this.columns.doc(columnId).collection('tickets').valueChanges();
  }

  loadTickets(columnId: string, ref?: string, dir?: string) {
    if (ref) this.sort.ref = ref;
    if (dir) this.sort.dir = dir;
    return this.columns
      .doc(columnId)
      .collection('tickets', this.ticketFilter.bind(this))
      .valueChanges();
  }

  ticketFilter(ref: any) {
    return this.sort.dir == 'desc'
      ? ref.orderBy(this.sort.ref, 'desc')
      : ref.orderBy(this.sort.ref, 'asc');
  }
  columnFilter(ref: any) {
    return this.sort.dir == 'desc'
      ? ref.orderBy(this.sortCol.ref, 'desc')
      : ref.orderBy(this.sortCol.ref, 'asc');
  }

  setSortRef(ref: string, dir: string) {
    this.sort.ref = ref;
    this.sort.dir = dir;
  }

  addTicket(ticket: Ticket) {
    return this.columns
      .doc(this.addTicketColumn)
      .collection('tickets')
      .doc(ticket.id)
      .set({ ...ticket });
  }

  addColumn() {
    let column = new Column();
    this.firestore
      .collection('boards')
      .doc(this.currentBoardRef)
      .collection('columns')
      .doc(column.id)
      .set({ ...column });
  }

  deleteTicket(columnId: string, ticketId: string ){
    console.log(columnId)
    console.log(ticketId)
   this.firestore.collection('boards').doc(this.currentBoardRef).collection('columns').doc(columnId).collection('tickets').doc(ticketId).delete().then(() => console.log('ticket deleted')).catch(err => console.log(err));
  }

  /*   getId() {
    this.firestore
      .collection('boards')
      .doc(this.currentBoardRef)
      .collection('columns')
      .doc(this.addTicketColumn)
      .collection('tickets').valueChanges().subscribe(
        tickets => this.currentTickets = tickets.map(t => {return t['id'].split('-')})
      )
      console.log(this.currentTickets)
    return Math.max(this.currentTickets.map((t: Ticket) => {return t.id}));
  } */
}
