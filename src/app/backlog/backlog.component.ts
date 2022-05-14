import { Component, OnDestroy, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { AddTicketService } from '../services/add-ticket.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss'],
})
export class BacklogComponent implements OnInit, OnDestroy {
  showBacklog = true;
  showTooltip = false;
  userSubscription!: Subscription;

  constructor(
    public fireService: FirestoreService,
    private authService: AuthenticationService,

    public addTicketServ: AddTicketService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    if(await this.authService.loggedInAsGuest()){
      if(this.fireService.currentUser) this.loadBacklog();
      else{
        console.log('else 1');
        await this.fireService.getCurrentUserFromLocalStorage();
        this.loadBacklog();
      } 
    } else if (!this.fireService.currentUser) {
      this.userSubscription = this.fireService.currentUser$.subscribe(
        (user) => {
          if (user) {
            if (
              this.fireService.currentUser &&
              this.fireService.currentUser.uid != ''
            ) {
              this.loadBacklog();
            } else {
              this.showBacklog = false;
            }
          }
        }
      );
    } else {
      if (this.fireService.currentUser.uid != '') this.loadBacklog();
      else this.showBacklog = false;
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) this.userSubscription.unsubscribe();
    this.fireService.backlogTicketsSubscription.unsubscribe();
    this.fireService.currentBoard = undefined;
  }

  async loadBacklog() {
    let boardId = this.getBoardIdFromURL();
    await this.fireService.loadCurrentBoard(boardId);
    if (this.userHasAccess()) {
      this.showBacklog = true;
      this.fireService.loadBacklogTickets();
    } else {
      this.showBacklog = false;
    }
  }

  userHasAccess() {
    return (
      this.fireService.currentBoard?.userId ===
      this.fireService.currentUser?.uid
    );
  }

  getBoardIdFromURL() {
    let boardId!: string;
    this.route.params.subscribe((params) => {
      boardId = params['boardId'];
    });
    return boardId;
  }

  toggleTooltip() {
    this.showTooltip = !this.showTooltip;
  }
}
