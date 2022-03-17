import { Component, Input, OnInit } from '@angular/core';
import { Board } from '../models/Board.class';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
@Input() board!: Board;

  isAddingTicket = false;
  addToColumn = ''

  constructor() { }

  ngOnInit(): void {
  }
  addingTicket(){
    this.isAddingTicket = !this.isAddingTicket;
    console.log('received eventmission')
    console.log(this.isAddingTicket)
  }
}
