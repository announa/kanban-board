import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-board-column',
  templateUrl: './board-column.component.html',
  styleUrls: ['./board-column.component.scss']
})
export class BoardColumnComponent implements OnInit {
  @Output() addingTicket = new EventEmitter;

  constructor(public fireService: FirestoreService) { }

  ngOnInit(): void {
  }

  addTicket(id: string){
    console.log(id)
    this.addingTicket.emit(true);
    this.fireService.addTicketColumn = id;
  }
}
