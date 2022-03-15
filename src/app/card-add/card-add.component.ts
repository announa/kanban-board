import { Component, Input, OnInit } from '@angular/core';
import { Board } from '../models/Board.class';
import { Card } from '../models/Card.class';

@Component({
  selector: 'app-card-add',
  templateUrl: './card-add.component.html',
  styleUrls: ['./card-add.component.scss']
})
export class CardAddComponent implements OnInit {

  @Input() isAddingCard: boolean = false;
  @Input() board!: Board;
  card = new Card();

  constructor() { }

  ngOnInit(): void {
  }

}
