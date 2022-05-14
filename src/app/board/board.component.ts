import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Board } from '../models/Board.class';
import { AddTicketService } from '../services/add-ticket.service';
import { AuthenticationService } from '../services/authentication.service';
import { DragNdropService } from '../services/drag-ndrop.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('column', { read: ElementRef }) columns!: QueryList<ElementRef>;
  showBoard = true;
  showCategoriesModal = false;
  setBgImage = false;
  previewImage = '';
  userSubscription!: Subscription;

  constructor(
    public fireService: FirestoreService,
    private authService: AuthenticationService,
    public dragService: DragNdropService,
    public addTicketServ: AddTicketService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    if(await this.authService.loggedInAsGuest()){
      if(this.fireService.currentUser) this.loadBoard();
      else{
        console.log('else 1');
        await this.fireService.getCurrentUserFromLocalStorage();
        this.loadBoard();
      } 
    } else if (!this.fireService.currentUser) {
      this.userSubscription = this.fireService.currentUser$.subscribe(
        (user) => {
          if (user) {
            if (
              this.fireService.currentUser &&
              this.fireService.currentUser.uid != ''
            ) {
              this.loadBoard();
            } else {
              this.showBoard = false;
            }
          }
        }
      );
    } else {
      if (this.fireService.currentUser.uid != '') this.loadBoard();
      else this.showBoard = false;
    }
  }
  /* this.fireService.getUserFromLocalStorage(); */
  /*     if (this.fireService.currentUser.uid != '') {

  } */

  ngOnDestroy(): void {
    if (this.userSubscription) this.userSubscription.unsubscribe();
    this.fireService.currentBoard = undefined;
  }

  ngAfterViewInit(): void {
    this.dragService.columns = this.columns;
  }

  getBackgroundImage() {
    if (this.previewImage != '') {
      return `url('${this.previewImage}')`;
    } else {
      return `url('${this.fireService.currentBoard?.bgImg}')`;
    }
  }

  async loadBoard() {
    let boardId = this.getBoardIdFromURL();
    await this.fireService.loadCurrentBoard(boardId);
    if (this.userHasAccess()) {
      this.showBoard = true;
      this.fireService.loadColumns();
    } else {
      this.showBoard = false;
    }
  }

  getBoardIdFromURL() {
    let boardId!: string;
    this.route.params.subscribe((params) => {
      boardId = params['boardId'];
    });
    return boardId;
  }

  userHasAccess() {
    return (
      this.fireService.currentBoard?.userId ===
      this.fireService.currentUser?.uid
    );
  }

  openCatModal() {
    this.showCategoriesModal = true;
  }

  setPreviewImage(selectedImage: string) {
    this.previewImage = selectedImage;
  }
}
