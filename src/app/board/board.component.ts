import { Component, Input, OnInit } from '@angular/core';
import { Board } from '../models/Board.class';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  isAddingTicket = false;
  addToColumn = ''

  constructor(public fireService: FirestoreService) {
   }

  ngOnInit(): void {
  }
  addingTicket(status: boolean){
    this.isAddingTicket = status;
  }
}
