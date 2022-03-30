import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AddTicketService } from '../services/add-ticket.service';
import { Board } from '../models/Board.class';
import { DragNdropService } from '../services/drag-ndrop.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  constructor(
    public fireService: FirestoreService,
    public dragService: DragNdropService,
    public addTicketServ: AddTicketService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.fireService.loadCurrentBoard(id);
    });
  }

  startColumnAnim(columnData: any) {
    console.log(columnData);
    if (this.dragService.dragData.col1) {
      console.log('condition 1 true');
      console.log(columnData.column.order);
      console.log(this.dragService.dragData.col1.order);
      if (columnData.column.order < this.dragService.dragData.col1.order) {
        console.log('condition 2 true');
        this.moveColRight(columnData);
      }
    }
  }

  moveColRight(columnData: any) {
    console.log('moveColRight');
  }
}
