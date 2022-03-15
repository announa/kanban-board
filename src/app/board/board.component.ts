import { Component, Input, OnInit } from '@angular/core';
import { Board } from '../models/Board.class';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
@Input() board!: Board;

  isAddingCard = false;
  addToColumn = ''

  constructor() { }

  ngOnInit(): void {
  }
  addingCard(){
    this.isAddingCard = !this.isAddingCard;
    console.log('received eventmission')
    console.log(this.isAddingCard)
  }
}
