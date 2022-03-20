import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AddTicketService } from '../services/add-ticket.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-board-column',
  templateUrl: './board-column.component.html',
  styleUrls: ['./board-column.component.scss'],
})
export class BoardColumnComponent implements OnInit {
  constructor(
    public fireService: FirestoreService,
    public addticket: AddTicketService
  ) {}

  ngOnInit(): void {}
}
