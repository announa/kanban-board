import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Board } from '../models/Board.class';
import { Ticket } from '../models/Ticket.class';
import { AddTicketService } from '../services/add-ticket.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-ticket-add',
  templateUrl: './ticket-add.component.html',
  styleUrls: ['./ticket-add.component.scss'],
})
export class TicketAddComponent implements OnInit {
  action!: string;
  @Output() isAddingTicketChange = new EventEmitter();

  constructor(public fireService: FirestoreService, public addTicketServ: AddTicketService) {}

  ngOnInit(): void {}

}
