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
  boards: Board[] = [];
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
  backlogTickets!: any;
  columnTitles!: any;
  colOrder!: number[];
  ticket: any;
  users!: any;
  matchingUser!: User;
  currentUser!: User;
  currentUserId: string = '';
  isProcessing = false;

  constructor(
    private firestore: AngularFirestore,
    private route: ActivatedRoute
  ) {}

  loadBoards() {
    this.firestore
      .collection('boards', (ref) =>
        ref.where('userId', '==', this.currentUserId)
      )
      .valueChanges()
      .subscribe((boards: any) => {
        this.boards = boards;
      });
  }

  loadCurrentBoard(boardId: string) {
    this.currentBoardId = boardId;
    this.firestore
      .doc('boards/' + boardId)
      .valueChanges()
      .subscribe((board) => {
        this.currentBoard = board;
        console.log(this.currentBoard);
        this.loadColumns();
      });
  }

  resetBoard() {
    this.currentBoardId = '';
    this.currentBoard = undefined;
  }

  loadCurrentUser(userId: string) {
    this.firestore
      .doc('user/' + userId)
      .valueChanges()
      .subscribe((user: any) => {
        this.currentUser = user;
        console.log(this.currentUser);
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
    return this.firestore
      .collection('tickets', (ref) => ref.where('id', '==', ticketId))
      .valueChanges();
  }

  loadTickets(columnId: string, ref?: string, dir?: string) {
    if (ref) this.sort.ref = ref;
    if (dir) this.sort.dir = dir;
    return this.firestore
      .collection('tickets', (ref) => ref.where('columnId', '==', columnId))
      .valueChanges();
  }

  loadBacklogTickets() {
    this.firestore
      .collection('tickets', (ref) =>
        ref
          .where('columnId', '==', 'backlog')
          .where('boardId', '==', this.currentBoardId)
      )
      .valueChanges()
      .subscribe((tickets) => {
        this.backlogTickets = tickets;
      });
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

  updateTicket(ticket: Ticket) {
    return this.firestore
      .collection('tickets')
      .doc(ticket.id)
      .update({ ...ticket });
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

  deleteTicket(ticketId: string) {
    this.firestore.collection('tickets').doc(ticketId)
      .delete()
      .then(() => console.log(`ticket ${ticketId} deleted`))
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

  saveTitle(collection: string, id: string, newTitle: string) {
    this.firestore.collection(collection).doc(id).update({ title: newTitle });
  }

  moveTicket(ticket: any, col2: any) {
    this.firestore.collection('tickets').doc(ticket).update({ columnId: col2 });
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
    this.currentUserId = this.currentUser.id;
    this.isProcessing = false;

    return newUser.id;
  }

  clearData() {
    this.currentUser = {
      username: '',
      password: '',
      id: '',
    };
    this.currentUserId = '';
    this.currentBoardId = '';
  }

  checkForMatchingUser(userinput: { username: string; password: string }) {
    this.isProcessing = true;
    return this.firestore
      .collection('user', (ref) =>
        ref
          .where('username', '==', userinput.username)
          .where('password', '==', userinput.password)
      )
      .valueChanges();
  }

  checkForExistingUser(username: string) {
    this.isProcessing = true;
    return this.firestore
      .collection('user', (ref) => ref.where('username', '==', username))
      .valueChanges();
  }

  async setCurrentUser(id?: string) {
    if (id) {
      this.currentUserId = id;
      await this.getUserById();
      this.saveUserIdToLocalStorage();
    } else {
      this.currentUser = this.matchingUser;
      this.currentUserId = this.currentUser.id;
      this.saveUserIdToLocalStorage();
    }
    this.isProcessing = false;
  }

  async getUserById() {
    let result = await firstValueFrom(
      this.firestore
        .collection('user', (ref) => ref.where('id', '==', this.currentUserId))
        .valueChanges()
    );
    this.currentUser = result[0] as User;
  }

  saveUserIdToLocalStorage() {
    localStorage.setItem('userId', this.currentUserId);
  }

  getUserIdFromLocalStorage() {
    const storage = localStorage.getItem('userId');
    this.currentUserId = storage ? storage : '0';
  }

  removeUserIdFromLocalStorage() {
    localStorage.removeItem('userId');
  }

  // #############  Edit current board categories  ##############

  addNewCategory(newCategory: string) {
    let categories = this.currentBoard.categories;
    categories.push(newCategory);
    this.firestore
      .collection('boards')
      .doc(this.currentBoardId)
      .update({ categories: categories });
  }

  updateCategories(editedCategory: string, index: number) {
    let newCategoryArr = this.currentBoard.categories;
    newCategoryArr[index] = editedCategory;
    this.firestore
      .collection('boards')
      .doc(this.currentBoardId)
      .update({ categories: newCategoryArr });
  }

  deleteCategory(index: number) {
    let newCategoryArr = this.currentBoard.categories;
    newCategoryArr.splice(index, 1);
    this.firestore
      .collection('boards')
      .doc(this.currentBoardId)
      .update({ categories: newCategoryArr });
  }

  moveTicketToBoard(ticketId: string) {
    this.firestore.collection('columns', (ref => ref.where('boardId', '==', this.currentBoardId))).valueChanges().subscribe((cols: any[]) => {
      let colOrders = cols.map(col => col.order)
      const min = Math.min(...colOrders)
      const matchingCol = cols.find(col => col.order == min)
      this.firestore.collection('tickets').doc(ticketId).update({columnId: matchingCol.id})
    })
  }
}
