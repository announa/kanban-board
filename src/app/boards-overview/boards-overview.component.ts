import { Component, OnInit } from '@angular/core';
import { User } from '../models/User.class';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-boards-overview',
  templateUrl: './boards-overview.component.html',
  styleUrls: ['./boards-overview.component.scss'],
})
export class BoardsOverviewComponent implements OnInit {
  showTooltip = false;
  setBgImage = false;
  selectedBoard = '';
  isAddingBoard = false;

  constructor(public fireService: FirestoreService) {}

  ngOnInit(): void {
    this.fireService.getCurrentUserFromLocalStorage();
this.fireService.loadBoards();
    
    /* this.fireService.clearTemp(false); */
    /* this.fireService.loadUserBoards(); */
  }

  toggleTooltip() {
    this.showTooltip = !this.showTooltip;
  }

  setBackgroundImage(boardId: string) {
    this.setBgImage = true;
    this.selectedBoard = boardId;
  }
}
