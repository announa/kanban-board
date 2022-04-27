import { Component, Input, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { Board } from '../models/Board.class';
import { Ticket } from '../models/Ticket.class';
import { AddTicketService } from '../services/add-ticket.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-ticket-add',
  templateUrl: './ticket-add.component.html',
  styleUrls: ['./ticket-add.component.scss'],
})
export class TicketAddComponent implements OnInit {
  action!: string;
  categories: {category: string, color: string}[] = []
  selectedCategory: string = '';
  colorsAreOpen = false;
  @HostListener('document:click', ['$event'])
  clickEvent(event: any){
    this.colorsAreOpen = false;
  }

  constructor(
    public fireService: FirestoreService,
    public addTicketServ: AddTicketService
  ) {}

  ngOnInit(): void {
    this.getBoardCategories();
  }

  getBoardCategories(){
    if(this.fireService.currentBoard)
    this.categories = this.fireService.currentBoard.categories;
  }

  getMinDate() {
    let date: Date | string = new Date();
    let mm =
      date.getMonth() + 1 >= 10
        ? date.getMonth() + 1
        : '0' + (date.getMonth() + 1);
    let dd = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();
    date = date.getFullYear() + '-' + mm + '-' + dd;
    return date;
  }

  saveTicket(){
/*     const category = {category: this.selectedCategory, color: this.getCategoryColor()} */
    this.addTicketServ.saveTicket()
  }
/* 
  getCategoryColor(){
    const category = this.categories.find(category => category.category == this.selectedCategory)
    return category? category.color : '#fff';
  } */

  toggleCategoryColor(event: any){
    event.stopPropagation()
    this.colorsAreOpen = !this.colorsAreOpen;
  }
}
