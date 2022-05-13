import { Component, OnDestroy, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { AddTicketService } from '../services/add-ticket.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss']
})
export class BacklogComponent implements OnInit, OnDestroy {
  showBacklog = true;
  showTooltip = false;

  constructor(public fireService: FirestoreService, public addTicketServ: AddTicketService, private route: ActivatedRoute) { }

  ngOnInit(): void {
   /*  this.fireService.getUserFromLocalStorage(); */
    if (this.fireService.currentUser?.uid != '') {
      this.loadBacklog();
    } else {
      this.showBacklog = false;
    }
  }

  ngOnDestroy(): void {
    this.fireService.backlogTicketsSubscription.unsubscribe()
  }
  
  async loadBacklog(){
    let boardId = this.getBoardIdFromURL();
    await this.fireService.loadCurrentBoard(boardId);
    if (this.userHasAccess()) {
      this.showBacklog = true;
      this.fireService.loadBacklogTickets()
    } else {
      this.showBacklog = false;
    }
  }

  userHasAccess() {
    return (
      this.fireService.currentBoard?.userId === this.fireService.currentUser?.uid
    );
  }

  getBoardIdFromURL() {
    let boardId!: string;
    this.route.params.subscribe((params) => {
      boardId = params['boardId'];
    });
    return boardId;
  }

  toggleTooltip(){
    this.showTooltip = !this.showTooltip
  }
}
