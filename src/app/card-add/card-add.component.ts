import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Board } from '../models/Board.class';
import { Card } from '../models/Card.class';

@Component({
  selector: 'app-card-add',
  templateUrl: './card-add.component.html',
  styleUrls: ['./card-add.component.scss'],
})
export class CardAddComponent implements OnInit {
  @Input() isAddingCard: boolean = false;
  @Input() board!: Board;
  @Output() isAddingCardChange = new EventEmitter;
  card = new Card();

  constructor() {}

  ngOnInit(): void {}
  closeModal() {
    this.isAddingCardChange.emit(!this.isAddingCard);
  }
}
