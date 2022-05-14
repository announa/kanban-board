import {
  Component,
  OnInit,
  HostListener,
  ViewChildren,
  QueryList,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { AddTicketService } from '../services/add-ticket.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-ticket-add',
  templateUrl: './ticket-add.component.html',
  styleUrls: ['./ticket-add.component.scss'],
})
export class TicketAddComponent implements OnInit {
  @ViewChildren('selectItem') selectItem!: QueryList<ElementRef>;
  @ViewChild('selectItemContainer') selectItemContainer!: ElementRef;
  @ViewChild('selectArrow') selectArrow!: ElementRef;
  action!: string;
  categories: { category: string; color: string }[] = [];
  selectedCategoryTitle = 'Select a category ...';
  selectedCategoryColor = '';
  colorsAreOpen = false;
  selectedCategoryNumber!: number;
  @HostListener('document:click', ['$event'])
  clickEvent(event: any) {
    this.colorsAreOpen = false;
  }

  constructor(
    public fireService: FirestoreService,
    public addTicketServ: AddTicketService
  ) {}

  ngOnInit(): void {
    this.getBoardCategories();
  }

  getBoardCategories() {
    if (this.fireService.currentBoard)
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

  saveTicket() {
    /*     const category = {category: this.selectedCategoryTitle, color: this.getCategoryColor()} */
    /* const categoryNumber = this.getCategoryNumber() */
    this.addTicketServ.saveTicket(this.selectedCategoryNumber);
  }

  /*   getCategoryNumber(){
    return this.categories.findIndex(cat => cat.category == this.selectedCategoryNumber)
  } */
  /* 
  getCategoryColor(){
    const category = this.categories.find(category => category.category == this.selectedCategoryTitle)
    return category? category.color : '#fff';
  } */

  toggleSelectMenu() {
    this.selectItemContainer.nativeElement.classList.toggle('d-none');
    this.selectArrow.nativeElement.classList.toggle('rotate');
  }

  toggleCategoryColor(event: any) {
    event.stopPropagation();
    this.colorsAreOpen = !this.colorsAreOpen;
  }

  selectCategory(index: number) {
    if(index > -1){
    this.selectedCategoryNumber = index;
    this.selectedCategoryTitle =
      this.categories[this.selectedCategoryNumber].category;
    this.selectedCategoryColor =
      this.categories[this.selectedCategoryNumber].color;
    } else{
      this.selectedCategoryTitle = 'Select a category ...'
      this.selectedCategoryNumber = -1;
      this.selectedCategoryColor = '';
    }
    this.toggleSelectMenu();
  }
}
