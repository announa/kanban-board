import { Component, OnInit, HostListener } from '@angular/core';
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
  ticketCategory!: string;
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
const categoryNumber = this.getCategoryNumber()
    this.addTicketServ.saveTicket(categoryNumber)
  }

  getCategoryNumber(){
    return this.categories.findIndex(cat => cat.category == this.ticketCategory)
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
