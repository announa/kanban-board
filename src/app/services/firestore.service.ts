import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { firstValueFrom, Observable, Subscription } from 'rxjs';
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
  currentUser!: User;
  matchingUser!: User;
  currentBoard!: Board;
  userCollectionSubscription!: Subscription;
  boardSubscription!: Subscription;
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
      this.userCollectionSubscription = this.firestore
        .collection(collection)
        .valueChanges()
        .subscribe((user) => {
          if (collection == 'user') this.users = user as User[];
          else this.guests = user as User[];
          resolve(user);
        }),
        (err: any) => reject(err);
    });
  }

  loadCurrentUser(userId: string) {
    this.getDocRef('user', userId)
      .valueChanges()
      .subscribe((user: any) => {
        this.currentUser = user;
      });
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
    this.getFilteredCollection(
      'boards',
      'userId',
      '==',
      this.currentUser.id
    ).subscribe((boards: any) => {
      this.boards = boards;
    });
  }

  loadCurrentBoard(boardId: string) {
    return new Promise((resolve, reject) => {
      (this.boardSubscription = this.getDocRef('boards', boardId)
        .valueChanges()
        .subscribe((board) => {
          this.currentBoard = board as Board;
          console.log('load current board')
          console.log(this.currentBoard)
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
            .where('boardId', '==', this.currentBoard.id)
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

  loadBacklogTickets() {
    this.backlogTicketsSubscription = this.getFilteredCollection(
      'tickets',
      'columnId',
      '==',
      'backlog',
      'boardId',
      '==',
      this.currentBoard.id
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
    newBoard.userId = this.currentUser.id;
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
        if (this.boardSubscription) this.boardSubscription.unsubscribe();
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
    const subCollection = await firstValueFrom(this.getFilteredCollection(collection, field, '==', id)) as any;

        for (let index = 0; index < subCollection.length; index++) {
          const item = subCollection[index];
          await this.deleteFromDb(collection, item.id);
        
      }
  }

  async deleteDoc(collection: string, id: string) {
    await this.firestore.collection(collection).doc(id).delete();
  }

 async deleteUserImages(userId: string) {
    console.log('delete guest images ' + userId)

    const user = await firstValueFrom( this.getDocRef('guest', userId).valueChanges() ) as User;
    

    for (let index = 0; index < user.userImages.length; index++) {
      const image = user.userImages[index];
      await this.storage.storage.ref(image.filePath).delete();
    }
/* 



    this.deleteImagesSubscription = this.getFilteredCollection('guest', 'id', '==', userId).subscribe(async (user: any) => {
      console.log(user)
      user[0].userImages.forEach(async (image: any) => {
        console.log('delete guest image ' + image)
        await this.storage.storage.ref(image.filePath).delete();
      });
    }); */
  }

  // #############  Register and login  ##############

  async addUser(newUser: User) {
    newUser.id = Date.now().toString();
    this.isProcessing = true;
    await this.addDoc('user', newUser.id, newUser);
    this.currentUser = newUser;
    this.isProcessing = false;
    return newUser.id;
  }

  checkForMatchingUser(userinput: { username: string; password: string }) {
    this.isProcessing = true;
    return this.users.filter(
      (user) =>
        user.username == userinput.username
/*          &&
        user.password == userinput.password */
    );
  }

  checkForExistingUser(username: string) {
    this.isProcessing = true;
    return this.users.filter((user) => user.username == username);
  }

  async setCurrentUser(matchingUser: User) {
    this.currentUser = matchingUser;
    this.saveUserToLocalStorage();
    this.isProcessing = false;
  }

  saveUserToLocalStorage() {
    localStorage.setItem('user', JSON.stringify(this.currentUser));
  }

  getUserFromLocalStorage() {
    const storage = localStorage.getItem('user');
    this.currentUser = storage ? JSON.parse(storage) : new User();
    console.log(this.currentUser);
  }

  removeUserFromLocalStorage() {
    localStorage.removeItem('user');
  }

  // #############  Guest Account  #############

  async setGuestAccount(guest: any) {
    new Promise(async (resolve, reject) => {
      const newGuest = await this.setIds(guest);
      this.setTemp(newGuest);
      this.saveUserToLocalStorage();
      resolve('guest account set'), (err: any) => reject(err);
    });
  }

  setIds(guest: any) {
    [guest.guest.id, guest.guestBoard.userId, guest.guestBoard.id] = Array(
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

  setTemp(guest: any) {
    this.currentUser = guest.guest;
    this.currentBoard = guest.guestBoard;
    this.columns = guest.guestColumns;
  }

  async setGuestAccountInDb(guest: any) {
    await this.addDoc('guest', guest.guest.id, guest.guest);
    await this.addDoc('boards', guest.guestBoard.id, guest.guestBoard);
    guest.guestColumns.forEach(async (col: any) => {
      await this.addDoc('columns', col.id, col);
    });
    guest.guestTickets.forEach(async (ticket: any) => {
      await this.addDoc('tickets', ticket.id, ticket);
    });
  }

  checkForOldGuestData() {
    const oldGuests = this.guests.filter((guest) => guest.id <= this.oneDay());
    this.deleteOldGuestData(oldGuests as User[]);
  }

  oneDay() {
    return (Date.now() - 86400000).toString();
  }

  deleteOldGuestData(oldGuests: User[]) {
    oldGuests.forEach((guest) => this.deleteFromDb('guest', guest.id));
  }

  // #############  Logout  ###############

  clearData() {
    return new Promise((resolve, reject) => {
      if (this.currentUser.username == 'guest') {
        console.log('delete guest data');
        this.deleteCurrentGuestData();
      }
      this.clearTemp(true);
      this.removeUserFromLocalStorage();
      resolve('data deleted'), (err: any) => reject(err);
    });
  }

  deleteCurrentGuestData() {
    this.deleteFromDb('guest', this.currentUser.id);
  }

  clearTemp(clearUser: boolean) {
    if (clearUser) {
      this.currentUser = new User();
    }
    this.currentBoard = new Board();
    this.backlogTickets = [];
    this.columns = [];
  }

/*   getEmptyUser() {
    return {
      username: '',
      password: '',
      id: '',
      userImages: [],
    };
  } */

  // #############  Edit current board categories  ##############

  addNewCategory(newCategory: {category: string, color: string}) {
    if (this.currentBoard) {
      let categories = this.currentBoard.categories;
      categories.push(newCategory);
      this.updateDoc('boards', this.currentBoard.id, {
        categories: categories,
      });
    }
  }

  updateCategories(editedCategory: {category: string, color: string}, index: number) {
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
      this.currentBoard.id
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
