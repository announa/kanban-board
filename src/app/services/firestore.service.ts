import { ThisReceiver } from '@angular/compiler';
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
  currentBoard!: Board | undefined;
  currentBoardId!: string;
  /*   columnsRef!: any;
   */ columns: Column[] = [];
  /*   count!: number;
   */ sortCol = {
    ref: 'order',
    dir: 'asc',
  };
  sort = {
    ref: 'id',
    dir: 'desc',
  };
  /*  currentTickets!: any; */
  backlogTickets: Ticket[] = [];
  /*   columnTitles!: any;
   */ colOrder!: number[];
  /*   ticket: any;
  users!: any; */
  matchingUser!: User;
  currentUser!: User;
  currentUserId: string = '';
  isProcessing = false;

  constructor(
    private firestore: AngularFirestore,
    private route: ActivatedRoute
  ) {}

  getDocRef(collection: string, doc: string) {
    return this.firestore.collection(collection).doc(doc);
  }

  getFilteredCollection(
    collection: string,
    field: string,
    operator: any,
    value: any,
    field2?: string,
    operator2?: any,
    value2?: any
  ) {
    if (!field2) {
      return this.firestore
        .collection(collection, (ref) => ref.where(field, operator, value))
        .valueChanges();
    } else {
      return this.firestore
        .collection(collection, (ref) =>
          ref.where(field, operator, value).where(field2, operator2, value2)
        )
        .valueChanges();
    }
  }

  loadBoards() {
    this.getFilteredCollection(
      'boards',
      'userId',
      '==',
      this.currentUserId
    ).subscribe((boards: any) => {
      this.boards = boards;
    });
  }

  loadCurrentBoard(boardId: string) {
    this.currentBoardId = boardId;
    this.getDocRef('boards', boardId)
      .valueChanges()
      .subscribe((board) => {
        this.currentBoard = board as Board;
        this.loadColumns();
      });
  }

  loadCurrentUser(userId: string) {
    this.getDocRef('user', userId)
      .valueChanges()
      .subscribe((user: any) => {
        this.currentUser = user;
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
      .subscribe((columns: any) => {
        this.columns = columns;
        columns.forEach((col: any) => {
          this.colOrder = [];
          this.colOrder.push(Number(col.order));
        });
      });
  }

  loadTickets(columnId: string, ref?: string, dir?: string) {
    if (ref) this.sort.ref = ref;
    if (dir) this.sort.dir = dir;
    return this.getFilteredCollection('tickets', 'columnId', '==', columnId);
  }

  loadBacklogTickets() {
    this.getFilteredCollection(
      'tickets',
      'columnId',
      '==',
      'backlog',
      'boardId',
      '==',
      this.currentBoardId
    ).subscribe((tickets: any) => {
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

  async addDoc(collection: string, id: string, object: any) {
    return await this.firestore
      .collection(collection)
      .doc(id)
      .set({ ...object })
      .then(() => console.log(`new ${collection}-object with id ${id} added`))
      .catch((err) => console.log(err));
  }

  async updateDoc(collection: string, id: string, update: any) {
    return await this.firestore.collection(collection).doc(id).update(update);
  }

  addColumn() {
    let order_max = this.colOrder.length > 0 ? Math.max(...this.colOrder) : 0;
    let column = new Column(order_max, this.currentBoardId);
    this.addDoc('columns', column.id, column);
  }

  addBoard() {
    let newBoard = new Board();
    newBoard.userId = this.currentUser.id;
    this.addDoc('boards', newBoard.id, newBoard);
  }

  // ##############  Delete  ##############

  async deleteFromDb(collection: string, id: string) {
    switch (collection) {
      case 'boards':
        await this.deleteSubCollection('columns', 'boardId', id);
        break;
      case 'columns':
        await this.deleteSubCollection('tickets', 'columnId', id);
        /*  this.updateColOrder(id); */
        break;
    }
    this.deleteDoc(collection, id);
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
      if (collection == 'columns') {
        await this.deleteFromDb('columns', item.ref);
      } else {
        await this.deleteDoc(collection, item.ref);
      }
    }
  }

  async deleteDoc(collection: string, id: string) {
    await this.firestore
      .collection(collection)
      .doc(id)
      .delete()
      .then(() => console.log(collection + '-item deleted'))
      .catch((err) => console.log(err));
  }

  // #############  Register and login  ##############

  async addUser(newUser: User) {
    newUser.id = Date.now().toString();
    this.isProcessing = true;
    await this.addDoc('user', newUser.id, newUser);
    this.currentUser = newUser;
    this.currentUserId = this.currentUser.id;
    this.isProcessing = false;
    return newUser.id;
  }

  checkForMatchingUser(userinput: { username: string; password: string }) {
    this.isProcessing = true;
    return this.getFilteredCollection(
      'user',
      'username',
      '==',
      userinput.username,
      'password',
      '==',
      userinput.password
    );
  }

  checkForExistingUser(username: string) {
    this.isProcessing = true;
    return this.getFilteredCollection('user', 'username', '==', username);
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
    const collection = this.currentUserId.includes('guest') ? 'guest' : 'user';
    this.getDocRef(collection, this.currentUserId)
      .valueChanges()
      .subscribe((user) => (this.currentUser = user as User));
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

  // #############  Guest Account  #############

  async setGuestAccount(guest: any) {
    new Promise(async (resolve, reject) => {
      const guestNew = await this.setIds(guest);
      this.setTemp(guestNew);
      this.saveUserIdToLocalStorage();
      resolve('guest account set');
    });
  }

  setIds(guest: any) {
    [guest.guest.id, guest.guestBoard.userId, guest.guestBoard.id] = Array(
      3
    ).fill('guest' + Date.now().toString());
    guest.guestColumns.forEach((c: any, i: number) => {
      c.id = Date.now().toString() + i.toString();
      c.boardId = guest.guestBoard.id;
    });
    guest.guestTickets.forEach((t: any, i: number) => {
      t.id = Date.now().toString() + i.toString();
      t.columnId = guest.guestColumns[0].id;
      if (i == 1) t.columnId = guest.guestColumns[1].id;
      t.boardId = guest.guestBoard.id;
    });
    return guest;
  }

  setTemp(guest: any) {
    this.currentUser = guest.guest;
    this.currentUserId = guest.guest.id;
    this.currentBoard = guest.guestBoard;
    this.currentBoardId = guest.guestBoard.id;
    this.columns = guest.guestColumns;
  }

  async setGuestAccountInDb(guest: any) {
    await this.addDoc('guest', guest.guest.id, guest.guest);
    await this.addDoc('boards', guest.guestBoard.id, guest.guestBoard);
    guest.guestColumns.forEach(async (col: any) => {
      await this.addDoc('columns', col.id, col);
    });
    guest.guestTickets.forEach(async (ticket: any) => {
      await this.addDoc('coticketslumns', ticket.id, ticket);
    });
  }

  checkForOldGuestData() {}
  // #############  Logout  ###############

  clearData() {
    if (this.currentUserId.includes('guest')) {
      console.log('delete guest data');
      this.clearGuestData();
    }
    this.clearTemp(true);
    this.removeUserIdFromLocalStorage();
  }

  clearGuestData() {
    console.log(this.boards);
    this.boards.forEach(async (board) => {
      console.log('delete board ' + board.id);
      await this.deleteFromDb('boards', board.id);
    });
    this.deleteDoc('guest', this.currentUserId);
  }

  clearTemp(clearUser: boolean) {
    if (clearUser) {
      this.currentUser = {
        username: '',
        password: '',
        id: '',
      };
      this.currentUserId = '';
    }
    this.currentBoardId = '';
    this.currentBoard = undefined;
    this.backlogTickets = [];
    this.columns = [];
  }

  // #############  Edit current board categories  ##############

  addNewCategory(newCategory: string) {
    if (this.currentBoard) {
      let categories = this.currentBoard.categories;
      categories.push(newCategory);
      this.updateDoc('boards', this.currentBoardId, { categories: categories });
    }
  }

  updateCategories(editedCategory: string, index: number) {
    if (this.currentBoard) {
      let newCategoryArr = this.currentBoard.categories;
      newCategoryArr[index] = editedCategory;
      this.updateDoc('boards', this.currentBoardId, {
        categories: newCategoryArr,
      });
    }
  }

  deleteCategory(index: number) {
    if (this.currentBoard) {
      let newCategoryArr = this.currentBoard.categories;
      newCategoryArr.splice(index, 1);
      this.updateDoc('boards', this.currentBoardId, {
        categories: newCategoryArr,
      });
    }
  }

  // ##############  Move tickets and columns  ##############

  moveTicketToBoard(ticketId: string) {
    this.getFilteredCollection(
      'columns',
      'boardId',
      '==',
      this.currentBoardId
    ).subscribe((cols: any[]) => {
      let colOrders = cols.map((col) => col.order);
      const min = Math.min(...colOrders);
      const matchingCol = cols.find((col) => col.order == min);
      this.updateDoc('tickets', ticketId, { columnId: matchingCol.id });
    });
  }

  moveColumn(col1: any, col2: any) {
    let order_col2_new =
      col1.order < col2.order ? Number(col2.order) - 1 : Number(col2.order) + 1;
    this.updateDoc('columns', col1.id, { order: col2.order });
    this.updateDoc('columns', col2.id, { order: order_col2_new });
  }
}
