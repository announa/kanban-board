import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-board-column',
  templateUrl: './board-column.component.html',
  styleUrls: ['./board-column.component.scss']
})
export class BoardColumnComponent implements OnInit {
  @Output() addingCard = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  addCard(){
    console.log('add card')
    this.addingCard.emit();
  }
}
