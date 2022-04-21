import { ConstantPool } from '@angular/compiler';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from './services/firestore.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kanban-board';
  /* board = new Board('Board 1', ['Category 1', 'Category 2', 'Category 3']) */

  guest = {
    username: 'guest',
    password: '',
    id: 'guest'
   }
   
   board_guest = {
    title: 'Testboard 1',
    categories: ['Management', 'Product', 'Sale'],
    id: '1',
    userId: 'guest',
    bgImg: 'bg-1.jpg',
   }
   
   column1_guest = {
    title: 'To do',
    order: 1,
    id: '1',
    boardId: '1',
   }
   
   column2_guest = {
    title: 'Im Progress',
    order: 2,
    id: '2',
    boardId: '1',
   }
   
   column3_guest = {
    title: 'Testing',
    order: 3,
    id: '3',
    boardId: '1',
   }
   
   column4_guest = {
    title: 'Done',
    order: 4,
    id: '4',
    boardId: '1',
    date: new Date().toDateString()
   }

  constructor(public fireService: FirestoreService, public router:Router){}
  ngOnInit(): void {
  }
  
  ngOnDestroy(){
      this.deleteData()
  }
  
  deleteData(){
    this.fireService.clearData();
  }
}
