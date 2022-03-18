import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-board-column',
  templateUrl: './board-column.component.html',
  styleUrls: ['./board-column.component.scss']
})
export class BoardColumnComponent implements OnInit {
  @Output() addingTicket = new EventEmitter;

  constructor() { }

  ngOnInit(): void {
  }

  addTicket(){
    this.addingTicket.emit(true);
  }
}
