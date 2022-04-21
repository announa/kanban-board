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

  constructor(
    public fireService: FirestoreService,
    public addTicketServ: AddTicketService
  ) {}

  ngOnInit(): void {}

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
}
