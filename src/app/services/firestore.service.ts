import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { rejects } from 'assert';
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
  currentUser!: User | null;
  currentUser$ = new Subject();
  /*   currentUser$ = new Subject(); */
  dummyData: any;
  dummyDataSubscription!: Subscription;
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
    private storage: AngularFireStorage,
    private http: HttpClient
  ) {
    /* this.deleteFromDb('boards', 'aM7n90vHQI0URSJmDFYT') */
  }

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
    return user;
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
        'uid',
        '==',
        this.currentUser?.uid
      ).subscribe((boards: any) => {
        this.boards = boards;
        resolve(boards);
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
        resolve(tickets);
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

  async addDoc(collection: string, object: any) {
    return await this.firestore
      .collection(collection)
      .add({ ...object })
      .then(async (doc) => {
        object.id = doc.id;
        await this.setDoc(collection, { ...object }, object.id);
        console.log(collection + doc.id + ' added');
        return doc.id;
      })
      .catch((err) => console.log(err));
  }

  async setDoc(collection: string, object: any, id: string) {
    return await this.firestore
      .collection(collection)
      .doc(id)
      .set({ ...object })
      .catch((err) => console.log(err));
  }

  async updateDoc(collection: string, id: string, update: object) {
    return await this.firestore
      .collection(collection)
      .doc(id)
      .update(update)
      .then((result) => console.log(result));
  }

  addColumn() {
    const order_max =
      this.columns.length > 0
        ? this.columns[this.columns.length - 1].order + 1
        : 0;
    if (this.currentBoard) {
      let column = new Column(order_max, this.currentBoard.id);
      this.addDoc('columns', column);
    }
  }

  addBoard(title: string) {
    let newBoard = new Board(title);
    if (this.currentUser) newBoard.uid = this.currentUser.uid;
    this.addDoc('boards', newBoard);
  }

  // ##############  Delete  ##############

  async deleteFromDb(collection: string, id: string) {
    console.log(collection, id);
    switch (collection) {
      case 'guest':
      case 'user':
        await this.deleteUserImages(collection, id);
        await this.deleteSubCollection('boards', 'uid', id);
        await this.deleteDoc(collection, id);
        break;
      case 'boards':
        if (this.currentBoardSubscription)
          this.currentBoardSubscription.unsubscribe();
        await this.deleteSubCollection('columns', 'boardId', id);
        await this.deleteDoc(collection, id);
        break;
      case 'columns':
        await this.deleteSubCollection('tickets', 'columnId', id);
        await this.deleteDoc(collection, id);
        break;
      default:
        await this.deleteDoc(collection, id);
    }
  }

  async deleteSubCollection(collection: string, field: string, id: string) {
    console.log(collection, field, id);
    const subCollection = (await firstValueFrom(
      this.getFilteredCollection(collection, field, '==', id)
    )) as any;

    for (let index = 0; index < subCollection.length; index++) {
      const item = subCollection[index];
      await this.deleteFromDb(collection, item.id);
    }
  }

  async deleteDoc(collection: string, id: string) {
    console.log(collection, id);
    await this.firestore.collection(collection).doc(id).delete();
  }

  async deleteUserImages(collection: string, userId: string) {
    const user = (await firstValueFrom(
      this.getDocRef(collection, userId).valueChanges()
    )) as User;

    for (let index = 0; index < user.userImages.length; index++) {
      const image = user.userImages[index];
      await this.storage.storage.ref(image.filePath).delete();
    }
  }

  // #############  Register and login  ##############

  async addUser(userData: any) {
    this.isProcessing = true;
    let newUser = new User(
      userData.uid,
      userData.username,
      userData.email,
      userData.emailVerified,
    );
    await this.addUserToDb(newUser, userData.isAnonymous) 
    this.isProcessing = false;
  }

  async addUserToDb(newUser: User, isAnonymous: boolean){
    const collection = isAnonymous ? 'guest' : 'user';
    await this.setDoc(collection, newUser, newUser.uid);
    this.currentUser = newUser;
  }

  // #############  Guest Account  #############

  createDummyData(userId: any) {
    this.dummyData = this.http.get('assets/json/dummy.json');
    this.dummyDataSubscription = this.dummyData.subscribe(async (data: any) => {
      data.board.uid = userId;
      await this.addDummyDataToDb(data);
      this.isProcessing = false;
    });
  }

  async setAccountData(dummyData: any, userId: string) {
    new Promise(async (resolve, reject) => {
      dummyData.board.uid = userId;
      resolve('new account example data set'), (err: any) => reject(err);
    });
  }

  async addDummyDataToDb(data: any) {
    const boardId = await this.addDummyBoard(data);
    this.addDummyColumns(data, boardId).then((colIds: any) => {
      this.addDummyTickets(data, colIds, boardId);
    });
  }

  async addDummyBoard(data: any) {
    return await this.addDoc('boards', data.board);
  }

  addDummyColumns(data: any, boardId: any) {
    return new Promise(async (resolve, reject) => {
      let colIds: any[] = [];
      for (let i = 0; i < data.columns.length; i++) {
        data.columns[i].boardId = boardId;
        let colId = await this.addDoc('columns', data.columns[i]);
        colIds.push(colId);
      }
      resolve(colIds), (err: any) => reject(err);
    });
  }

  addDummyTickets(data: any, colIds: any, boardId: any) {
    data = this.setDummyTicketIds(data, colIds);
    data.tickets.forEach(async (ticket: any) => {
      ticket.boardId = boardId;
      await this.addDoc('tickets', ticket);
    });
  }

  setDummyTicketIds(data: any, colIds: any) {
    [data.tickets[0], data.tickets[1]].forEach((t) => (t.columnId = colIds[0]));
    data.tickets[2].columnId = colIds[1];
    return data;
  }

  async checkForOldGuestData() {
    const oldGuests =  await this.filterGuests()
    if (oldGuests) await this.deleteOldGuestData(oldGuests as User[]);
  }

  filterGuests(){
    return new Promise((resolve, reject) => {
      const oldGuests = this.guests.filter(
        (guest) => Date.now() - parseInt(guest.uid) >= 86400000
      );
        resolve(oldGuests), (err: any) => reject(err)
    })
  }

  async deleteOldGuestData(oldGuests: User[]) {
    for(let i = 0; i < oldGuests.length; i++){
    await this.deleteFromDb('guest', oldGuests[i].uid);
  }}

  // #############  Logout  ###############

  clearTemp() {
    this.currentUser = null;
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
