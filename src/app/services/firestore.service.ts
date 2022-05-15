import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { firstValueFrom, Observable, Subject, Subscription } from 'rxjs';
import { Board } from '../models/Board.class';
import { Column } from '../models/Column.class';
import { Ticket } from '../models/Ticket.class';
import { User } from '../models/User.class';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  users: User[] = [];
  boards: Board[] = [];
  columns: Column[] = [];
  guests: User[] = [];
  currentUser: User | undefined;
  currentUser$ = new Subject();
  matchingUser!: User;
  currentBoard: Board | undefined;
  userCollectionSubscription!: Subscription;
  boardsSubscription!: Subscription;
  currentBoardSubscription!: Subscription;
  backlogTicketsSubscription!: Subscription;
  deleteImagesSubscription!: Subscription;
  sortCol = {
    ref: 'order',
    dir: 'asc',
  };
  sort = {
    ref: 'id',
    dir: 'desc',
  };
  backlogTickets: Ticket[] = [];
  colOrder!: number[];
  isProcessing = false;

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  getUserCollection(collection: string) {
    return new Promise((resolve, reject) => {
      (this.userCollectionSubscription = this.firestore
        .collection(collection)
        .valueChanges()
        .subscribe((user) => {
          if (collection == 'user') this.users = user as User[];
          else this.guests = user as User[];
          resolve(user);
        })),
        (err: any) => reject(err);
    });
  }

  async getCurrentUserFromDB(userId: string) {
    console.log('getCurrentUserFromDb');
    console.log(userId);
    let user = (await firstValueFrom(
      this.getDocRef('user', userId).valueChanges()
    )) as User;
    if (!user) {
      console.log(user);
      user = (await firstValueFrom(
        this.getDocRef('guest', userId).valueChanges()
      )) as User;
    }
    this.setCurrentUser(user);
  }

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
  ): Observable<unknown> {
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
    return new Promise((resolve, reject) => {
      (this.boardsSubscription = this.getFilteredCollection(
        'boards',
        'userId',
        '==',
        this.currentUser?.uid
      ).subscribe((boards: any) => {
        this.boards = boards;
      })),
        (err: any) => reject(err);
    });
  }

  loadCurrentBoard(boardId: string) {
    return new Promise((resolve, reject) => {
      (this.currentBoardSubscription = this.getDocRef('boards', boardId)
        .valueChanges()
        .subscribe((board) => {
          this.currentBoard = board as Board;
          resolve(board);
        })),
        (err: any) => reject(err);
    });
  }

  loadColumns() {
    return new Promise((resolve, reject) => {
      this.firestore
        .collection('columns', (ref) =>
          ref
            .where('boardId', '==', this.currentBoard?.id)
            .orderBy(this.sortCol.ref, 'asc')
        )
        .valueChanges()
        .subscribe((columns: any) => {
          this.columns = columns;
          resolve(this.columns);
        }),
        (err: any) => reject(err);
    });
  }

  loadTickets(columnId: string, ref?: string, dir?: string) {
    /*     if (ref) this.sort.ref = ref;
    if (dir) this.sort.dir = dir; */
    return this.getFilteredCollection('tickets', 'columnId', '==', columnId);
  }

  async loadBacklogTickets() {
    return new Promise((resolve, reject) => {
      (this.backlogTicketsSubscription = this.getFilteredCollection(
        'tickets',
        'columnId',
        '==',
        'backlog',
        'boardId',
        '==',
        this.currentBoard?.id
      ).subscribe((tickets: any) => {
        this.backlogTickets = tickets;
      })),
        (err: any) => reject(err);
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
    console.log(object);
    return await this.firestore
      .collection(collection)
      .doc(id)
      .set({ ...object })
      .catch((err) => console.log(err));
  }

  async updateDoc(collection: string, id: string, update: object) {
    return await this.firestore.collection(collection).doc(id).update(update);
  }

  addColumn() {
    const order_max =
      this.columns.length > 0
        ? this.columns[this.columns.length - 1].order + 1
        : 0;
    if (this.currentBoard) {
      let column = new Column(order_max, this.currentBoard.id);
      this.addDoc('columns', column.id, column);
    }
  }

  addBoard(title: string) {
    let newBoard = new Board(title);
    if (this.currentUser) newBoard.userId = this.currentUser.uid;
    this.addDoc('boards', newBoard.id, newBoard);
  }

  // ##############  Delete  ##############

  async deleteFromDb(collection: string, id: string) {
    switch (collection) {
      case 'guest':
        await this.deleteUserImages(id);
        await this.deleteSubCollection('boards', 'userId', id);
        break;
      case 'boards':
        if (this.currentBoardSubscription)
          this.currentBoardSubscription.unsubscribe();
        await this.deleteSubCollection('columns', 'boardId', id);
        break;
      case 'columns':
        await this.deleteSubCollection('tickets', 'columnId', id);
        break;
      case 'tickets':
    }
    await this.deleteDoc(collection, id);
  }

  async deleteSubCollection(collection: string, field: string, id: string) {
    const subCollection = (await firstValueFrom(
      this.getFilteredCollection(collection, field, '==', id)
    )) as any;

    for (let index = 0; index < subCollection.length; index++) {
      const item = subCollection[index];
      await this.deleteFromDb(collection, item.id);
    }
  }

  async deleteDoc(collection: string, id: string) {
    await this.firestore.collection(collection).doc(id).delete();
  }

  async deleteUserImages(userId: string) {
    const user = (await firstValueFrom(
      this.getDocRef('guest', userId).valueChanges()
    )) as User;

    for (let index = 0; index < user.userImages.length; index++) {
      const image = user.userImages[index];
      await this.storage.storage.ref(image.filePath).delete();
    }
  }

  // #############  Register and login  ##############

  async addUser(fireAuthUser: User) {
    this.isProcessing = true;
    let newUser = new User(
      fireAuthUser.uid,
      fireAuthUser.email,
      fireAuthUser.emailVerified
    );
    await this.addDoc('user', newUser.uid, newUser);
    this.currentUser = newUser;
    this.isProcessing = false;
  }

  saveUserToLocalStorage(object: any) {
    localStorage.setItem('user', JSON.stringify(object));
  }

  async getCurrentUserFromLocalStorage() {
    console.log('getCurrentUserFromLocalStorage');
    const storage = localStorage.getItem('user');
    if (storage) {
      const firebaseUser = await JSON.parse(storage);
      await this.getCurrentUserFromDB(firebaseUser.uid);
    } else {
      this.setCurrentUser(undefined);
    }
  }

  setCurrentUser(user: User | undefined) {
    console.log('setCurrentUser');
    console.log(user);

    this.currentUser = user;
    this.currentUser$.next(this.currentUser);
  }

  // #############  Guest Account  #############

  async setGuestAccount(guest: any) {
    new Promise(async (resolve, reject) => {
      const newGuest = await this.setIds(guest);
      this.currentUser = guest.guest;
      this.saveUserToLocalStorage(newGuest.guest);
      resolve('guest account set'), (err: any) => reject(err);
    });
  }

  setIds(guest: any) {
    [guest.guest.uid, guest.guestBoard.userId, guest.guestBoard.id] = Array(
      3
    ).fill(Date.now().toString());
    guest.guestColumns.forEach((c: any, i: number) => {
      setTimeout(() => {
        c.id = Date.now().toString();
        c.boardId = guest.guestBoard.id;
      }, i);
    });
    guest.guestTickets.forEach((t: any, i: number) => {
      setTimeout(() => {
        t.id = Date.now().toString();
        t.columnId = guest.guestColumns[0].id;
        if (i == 1) t.columnId = guest.guestColumns[1].id;
        t.boardId = guest.guestBoard.id;
      }, i);
    });
    return guest;
  }

  async setGuestAccountInDb(guest: any) {
    await this.addDoc('guest', guest.guest.uid, guest.guest);
    await this.addDoc('boards', guest.guestBoard.id, guest.guestBoard);
    guest.guestColumns.forEach(async (col: any) => {
      await this.addDoc('columns', col.id, col);
    });
    guest.guestTickets.forEach(async (ticket: any) => {
      await this.addDoc('tickets', ticket.id, ticket);
    });
  }

  checkForOldGuestData() {
    console.log('check for old guest data');
    const oldGuests = this.guests.filter(
      (guest) => Date.now() - parseInt(guest.uid) >= 86400000
    );
    console.log(oldGuests);
    if (oldGuests) this.deleteOldGuestData(oldGuests as User[]);
  }

  deleteOldGuestData(oldGuests: User[]) {
    oldGuests.forEach((guest) => this.deleteFromDb('guest', guest.uid));
  }

  // #############  Logout  ###############

  clearData() {
    return new Promise(async (resolve, reject) => {
      if (this.currentUser?.username == 'guest') {
        await this.deleteCurrentGuestData();
      }
      this.clearTemp();
      resolve('data deleted'), (err: any) => reject(err);
    });
  }

  async deleteCurrentGuestData() {
    if (this.currentUser)
      await this.deleteFromDb('guest', this.currentUser.uid);
  }

  clearTemp() {
    this.currentUser = undefined;
    if (this.boardsSubscription) this.boardsSubscription.unsubscribe();
    this.boards = [];
    this.currentBoard = undefined;
    this.backlogTickets = [];
    this.columns = [];
  }

  // #############  Edit current board categories  ##############

  addNewCategory(newCategory: { category: string; color: string }) {
    if (this.currentBoard) {
      let categories = this.currentBoard.categories;
      categories.push(newCategory);
      this.updateDoc('boards', this.currentBoard.id, {
        categories: categories,
      });
    }
  }

  updateCategories(
    editedCategory: { category: string; color: string },
    index: number
  ) {
    if (this.currentBoard) {
      let newCategoryArr = this.currentBoard.categories;
      newCategoryArr[index] = editedCategory;
      this.updateDoc('boards', this.currentBoard.id, {
        categories: newCategoryArr,
      });
    }
  }

  deleteCategory(index: number) {
    if (this.currentBoard) {
      let newCategoryArr = this.currentBoard.categories;
      newCategoryArr.splice(index, 1);
      this.updateDoc('boards', this.currentBoard.id, {
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
      this.currentBoard?.id
    ).subscribe((cols: any) => {
      let colOrders = cols.map((col: any) => col.order);
      const min = Math.min(...colOrders);
      const matchingCol = cols.find((col: any) => col.order == min);
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
