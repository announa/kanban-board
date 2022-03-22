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
    ref: 'order',
    dir: 'asc',
  };
  sort = {
    ref: 'id',
    dir: 'desc',
  };
  currentTickets!: any;
  addTicketColumn!: string;
  columnTitles!: any;
  colOrder!: number[];

  constructor(private firestore: AngularFirestore) {}

  loadBoards() {
    this.firestore.collection('boards').valueChanges().subscribe(boards => this.boards = boards);

    this.firestore.collection('boards')
      .doc(this.currentBoardRef)
      .valueChanges()
      .subscribe((board: any) => {
        this.currentBoard = board;
        this.loadColumns();
        this.getColumnTitles();
        
      });
  }

  getBoards(){
    return this.firestore.collection('boards').valueChanges();
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
            console.log(data)
            const id = column.payload.doc.id;
            const tickets = this.getTickets(id);
            console.log(this.getTickets(id))
            return { id, ...data, tickets };
          });
        })
      );
    this.columns_data.subscribe((columns: any) => {
      this.colOrder = [];
      columns.forEach((col: any) => {
        this.colOrder.push(Number(col.order))
      });
    });
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
    return this.sortCol.dir == 'desc'
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
    let order_max = Math.max(...this.colOrder)
    let column = new Column(order_max);
    this.firestore
      .collection('boards')
      .doc(this.currentBoardRef)
      .collection('columns')
      .doc(column.id)
      .set({ ...column });
  }

  deleteTicket(columnId: string, ticketId: string) {
    this.firestore
      .collection('boards')
      .doc(this.currentBoardRef)
      .collection('columns')
      .doc(columnId)
      .collection('tickets')
      .doc(ticketId)
      .delete()
      .then(() => console.log('ticket deleted'))
      .catch((err) => console.log(err));
  }

  deleteColumn(columnId: string){
    this.firestore
    .collection('boards')
    .doc(this.currentBoardRef)
    .collection('columns')
    .doc(columnId)
    .delete()
    .then(() => console.log('column deleted'))
    .catch((err) => console.log(err));
  }

  getColumnTitles() {
    this.firestore
      .collection('boards')
      .doc(this.currentBoardRef)
      .collection('columns', this.columnFilter.bind(this))
      .valueChanges()
      .subscribe((columns) => {
        this.columnTitles = columns.map((c) => {
          return c['title'];
        });
      });
  }
  saveColumnTitle(columnId: string, newTitle: string) {
    console.log('saving new title');
    this.firestore
      .collection('boards')
      .doc(this.currentBoardRef)
      .collection('columns')
      .doc(columnId)
      .update({ title: newTitle });
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

  moveTicket(ticket: any, col1: any, col2: any) {
    this.columns
      .doc(col2.id)
      .collection('tickets')
      .doc(ticket.id)
      .set({ ...ticket });
    this.columns.doc(col1.id).collection('tickets').doc(ticket.id).delete();
  }

  moveColumn(col1: any, col2: any) {
    let order_col2_new = col1.order < col2.order ? Number(col2.order) - 1 : Number(col2.order) + 1;
    this.columns
      .doc(col1.id)
      .update({ order: col2.order});
    this.columns
      .doc(col2.id)
      .update({ order: order_col2_new});
  }
}
