import { ConstantPool } from '@angular/compiler';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from './services/firestore.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kanban-board';

  constructor(public fireService: FirestoreService, public router:Router){}
  ngOnInit(): void {
  }
}
