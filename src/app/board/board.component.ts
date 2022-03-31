import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, Query, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
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
export class BoardComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChildren('column' ,{read: ElementRef}) columns!: QueryList<ElementRef>;

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

  ngAfterViewInit(): void {
    this.dragService.columns = this.columns
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.dragService.columns = this.columns
  }
}
