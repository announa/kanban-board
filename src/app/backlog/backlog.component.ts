import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { AddTicketService } from '../services/add-ticket.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss']
})
export class BacklogComponent implements OnInit {
  showBacklog = true;
  showTooltip = false;

  constructor(public fireService: FirestoreService, public addTicketServ: AddTicketService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.fireService.getUserFromLocalStorage();
    if (this.fireService.currentUser.id != '') {
      this.loadBacklog();
    } else {
      this.showBacklog = false;
    }
  }
  
  loadBacklog(){
    this.getBoardIdFromURL();
    this.showBacklog = true;
    this.fireService.loadBacklogTickets()
  }

  getBoardIdFromURL(){
    this.route.params.subscribe((params) => {
      const boardId = params['boardId'];
      this.fireService.loadCurrentBoard(boardId);
    });
  }

  toggleTooltip(){
    this.showTooltip = !this.showTooltip
  }
}
