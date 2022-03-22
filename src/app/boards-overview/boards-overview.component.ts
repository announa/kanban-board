import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-boards-overview',
  templateUrl: './boards-overview.component.html',
  styleUrls: ['./boards-overview.component.scss']
})
export class BoardsOverviewComponent implements OnInit {

  constructor(public fireService: FirestoreService) { }

  ngOnInit(): void {
  }

}
