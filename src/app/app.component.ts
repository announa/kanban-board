import { Component } from '@angular/core';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { Board } from './models/Board.class';
import { FirestoreService } from './services/firestore.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kanban-board';
  /* board = new Board('Board 1', ['Category 1', 'Category 2', 'Category 3']) */

  constructor(public fireService: FirestoreService){}
  ngOnInit(): void {
  }
}
