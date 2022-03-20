import { Component, Input, OnInit } from '@angular/core';
import { Board } from '../models/Board.class';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  constructor(public fireService: FirestoreService) {
   }

  ngOnInit(): void {
  }
}
