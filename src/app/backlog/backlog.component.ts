import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { AddTicketService } from '../services/add-ticket.service';


@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss']
})
export class BacklogComponent implements OnInit {
  showBacklog = true;

  constructor(public fireService: FirestoreService, public addTicketServ: AddTicketService) { }

  ngOnInit(): void {
    this.fireService.getUserIdFromLocalStorage();
    if (this.fireService.currentUserId != '') {
      this.loadBacklog();
    } else {
      this.showBacklog = false;
    }
  }
  
  loadBacklog(){
    this.showBacklog = true;
    this.fireService.getUserById();
    this.fireService.loadBacklogTickets()
  }
}
