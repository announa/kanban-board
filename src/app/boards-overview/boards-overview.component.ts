import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-boards-overview',
  templateUrl: './boards-overview.component.html',
  styleUrls: ['./boards-overview.component.scss'],
})
export class BoardsOverviewComponent implements OnInit {
  constructor(
    public fireService: FirestoreService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
 /*    this.route.params.subscribe((params) => {
      const userId = params['userId'];
      this.fireService.setCurrentUser(userId)
      this.fireService.loadBoards(userId);
    }); */
    this.fireService.getUserIdFromLocalStorage();
    this.fireService.getUserById();
    this.fireService.loadBoards();
    console.log(this.fireService.boards)
  }
}
