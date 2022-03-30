import { ElementRef, Injectable, QueryList } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, map, Observable, pipe } from 'rxjs';
import { Board } from '../models/Board.class';
import { Column } from '../models/Column.class';
import { Ticket } from '../models/Ticket.class';
import { User } from '../models/User.class';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  tickets!: Observable<any>;
  boards!: any;
  currentBoard!: any;
  currentBoardId!: string;
  columnsRef!: any;
  columns!: any;
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
  columnTitles!: any;
  colOrder!: number[];
  ticket: any;
  users!: any;
  matchingUser!: User;
  currentUser!: User;
  isProcessing = false;

  constructor(
    private firestore: AngularFirestore,
    private route: ActivatedRoute
  ) {}

  loadBoards(userId: string) {
    this.boards = this.firestore
      .collection('boards', (ref) => ref.where('userId', '==', userId))
      .valueChanges()
      .subscribe((boards) => {
        this.boards = boards;
      });
  }

  loadCurrentBoard(id: string) {
    this.currentBoardId = id;
    this.firestore
      .doc('boards/' + id)
      .valueChanges()
      .subscribe((board) => {
        this.currentBoard = board;
        console.log(this.currentBoard);
        this.loadColumns();
      });
  }

  loadColumns() {
    this.colOrder = [];
    this.firestore
      .collection('columns', (ref) =>
        ref
          .where('boardId', '==', this.currentBoardId)
          .orderBy(this.sortCol.ref, 'asc')
      )
      .valueChanges()
      .subscribe((columns) => {
        this.columns = columns;
        columns.forEach((col: any) => {
          this.colOrder = [];
          this.colOrder.push(Number(col.order));
        });
      });
  }

  getTicket(ticketId: string) {
    return this.firestore.collection('tickets').doc(ticketId).get();
  }

  loadTickets(columnId: string, ref?: string, dir?: string) {
    if (ref) this.sort.ref = ref;
    if (dir) this.sort.dir = dir;
    return this.firestore
      .collection('tickets', (ref) => ref.where('columnId', '==', columnId))
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
    return this.firestore
      .collection('tickets')
      .doc(ticket.id)
      .set({ ...ticket });
  }

  addColumn() {
    let order_max = this.colOrder.length > 0 ? Math.max(...this.colOrder) : 0;
    let column = new Column(order_max, this.currentBoardId);
    this.firestore.doc('columns/' + column.id).set({ ...column });
  }

  addBoard() {
    let newBoard = new Board();
    newBoard.userId = this.currentUser.id;

    this.firestore
      .collection('boards')
      .doc(newBoard.id)
      .set({ ...newBoard });
  }

  deleteTicket(columnId: string, ticketId: string) {
    this.firestore
      .doc(this.columnsRef + '/' + columnId + '/tickets/' + ticketId)
      .delete()
      .then(() => console.log('ticket deleted'))
      .catch((err) => console.log(err));
  }

  deleteDoc(collection: string, id: string) {
    switch (collection) {
      case 'boards':
        this.deleteSubCollection('columns', 'boardId', id);
        break;
      case 'columns':
        this.deleteSubCollection('tickets', 'columnId', id);
        /*  this.updateColOrder(id); */
        break;
    }

    console.log(`deleteDoc ${collection} ${id}`);
    this.firestore
      .collection(collection)
      .doc(id)
      .delete()
      .then(() => console.log(collection + '-item deleted'))
      .catch((err) => console.log(err));
  }

  async deleteSubCollection(collection: string, field: string, id: string) {
    console.log(`delete subcollection ${collection} ${field} ${id}`);
    let subCollection = await firstValueFrom(
      this.firestore
        .collection(collection, (ref) => ref.where(field, '==', id))
        .valueChanges({ idField: 'ref' })
    );

    for (let index = 0; index < subCollection.length; index++) {
      const item = subCollection[index];
      console.log(item);
      await this.firestore.collection(collection).doc(item.ref).delete();
    }
  }

  /*   updateColOrder(id: string) {
    let currentOrder: number;
    let currentCol = this.firestore
      .collection('columns')
      .doc(id)
      .valueChanges();
  } */

  saveTitle(collection: string, id: string, newTitle: string) {
    console.log('saving new title');
    this.firestore.collection(collection).doc(id).update({ title: newTitle });
  }

  moveTicket(ticket: any, col1: any, col2: any) {
    this.firestore
      .collection('tickets')
      .doc(ticket.id)
      .update({ columnId: col2 });
  }

  moveColumn(col1: any, col2: any) {
    let order_col2_new =
      col1.order < col2.order ? Number(col2.order) - 1 : Number(col2.order) + 1;
    this.firestore
      .collection('columns')
      .doc(col1.id)
      .update({ order: col2.order });
    this.firestore
      .collection('columns')
      .doc(col2.id)
      .update({ order: order_col2_new });
  }

  // #############  Register and login  ##############

  async addUser(newUser: User) {
    newUser.id = Date.now().toString();
    this.isProcessing = true;
    await this.firestore
      .collection('user')
      .doc(newUser.id)
      .set({ ...newUser })
      .then(() => console.log(`new user with id ${newUser.id} added`))
      .catch((err) => console.log(err));
    this.currentUser = newUser;
    this.isProcessing = false;

    return newUser.id;
  }

  clearData() {
    this.currentUser = {
      username: '',
      password: '',
      id: '',
    };
    this.currentBoardId = '';
  }

  checkUsers(username: string, password: string) {
    return this.firestore
      .collection('user', (ref) =>
        ref.where('username', '==', username).where('password', '==', password)
      )
      .valueChanges()
      
  }

  setCurrentUser() {
    this.currentUser = this.matchingUser;
  }
}
