import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-boards-preview',
  templateUrl: './boards-preview.component.html',
  styleUrls: ['./boards-preview.component.scss'],
})
export class BoardsPreviewComponent implements OnInit {
  @Input('board') board: any;

  constructor(public fireService: FirestoreService, private router: Router) {}

  ngOnInit(): void {
  }

  navigate(boardId: string) {
    this.router.navigateByUrl('/board/' + boardId);
  }
}
