import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Query,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AddTicketService } from '../services/add-ticket.service';
import { DragNdropService } from '../services/drag-ndrop.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChildren('column', { read: ElementRef }) columns!: QueryList<ElementRef>;
  showBoard = true;
  showCategoriesModal = false;

  constructor(
    public fireService: FirestoreService,
    public dragService: DragNdropService,
    public addTicketServ: AddTicketService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    /* console.log(this.fireService.currentUser) */
    /* this.fireService.loadCurrentUser(userId); */
    this.fireService.getUserIdFromLocalStorage();
    if (this.fireService.currentUserId != '') {
      this.loadBoard();
    } else {
      this.showBoard = false;
    }
  }

  ngAfterViewInit(): void {
    this.dragService.columns = this.columns;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dragService.columns = this.columns;
  }

  loadBoard(){
    this.showBoard = true;
    this.fireService.getUserById();
    this.getBoardIdFromURL();
  }
  
  getBoardIdFromURL(){
    this.route.params.subscribe((params) => {
      const boardId = params['boardId'];
      this.fireService.loadCurrentBoard(boardId);
    });
  }

  openCatModal(){
    this.showCategoriesModal = true;
  }
}
