import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { AddTicketService } from '../services/add-ticket.service';


@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss']
})
export class BacklogComponent implements OnInit {

  constructor(public fireService: FirestoreService, public addTicketServ: AddTicketService) { }

  ngOnInit(): void {
    this.fireService.loadBacklogTickets()
  }

}
