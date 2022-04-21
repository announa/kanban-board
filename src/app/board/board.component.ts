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
    this.fireService.getUserFromLocalStorage();
    if (this.fireService.currentUser.id != '') {
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

  async loadBoard(){
    let boardId = this.getBoardIdFromURL();
    await this.fireService.loadCurrentBoard(boardId);
    if(this.userHasAccess()){
      this.showBoard = true;
      this.fireService.loadColumns();
    } else{
      this.showBoard = false;
    }
  }
  
  getBoardIdFromURL(){
    let boardId!: string;
    this.route.params.subscribe((params) => {
      boardId = params['boardId'];
    });
    return boardId;
  }

  userHasAccess(){
    return this.fireService.currentBoard?.userId === this.fireService.currentUser.id;
  }

  openCatModal(){
    this.showCategoriesModal = true;
  }
}
