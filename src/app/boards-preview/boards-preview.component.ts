import { Component, Input, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-boards-preview',
  templateUrl: './boards-preview.component.html',
  styleUrls: ['./boards-preview.component.scss']
})
export class BoardsPreviewComponent implements OnInit {
  @Input('board') board: any;

  constructor(public fireService: FirestoreService) { }

  ngOnInit(): void {
  }

  goToBoard(){

  }
}
