import { Component, ElementRef, Input, OnInit, Query, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AddTicketService } from '../services/add-ticket.service';
import { Board } from '../models/Board.class';
import { DragNdropService } from '../services/drag-ndrop.service';
import { FirestoreService } from '../services/firestore.service';
import { BoardColumnComponent } from '../board-column/board-column.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {

  @ViewChildren('column' ,{read: ElementRef}) columns!: QueryList<ElementRef>;
  colArr!: ElementRef[];

  constructor(
    public fireService: FirestoreService,
    public dragService: DragNdropService,
    public addTicketServ: AddTicketService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['boardId'];
      this.fireService.loadCurrentBoard(id);
    });
  }

  startColumnAnim(columnData: any) {
    console.log(columnData);
    if (this.dragService.dragData.col1) {
      console.log('condition 1 true');
      console.log(this.dragService.dragData.col1.order);
      if (this.dragService.dragData.col1_index && columnData < this.dragService.dragData.col1_index) {
        console.log('condition 2 true');
        this.moveColRight(columnData);
      }
    }
  }

  moveColRight(columnData: number) {
    console.log('moveColRight');
    console.log(this.columns)
    this.colArr = this.columns.toArray();
    console.log(this.colArr)
    this.colArr[columnData].nativeElement.firstChild.firstChild.classList.add('drag-animation-right')
  }
}
