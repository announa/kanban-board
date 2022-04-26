import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AddTicketService } from '../services/add-ticket.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss']
})
export class LoadingBarComponent implements OnInit, OnChanges {
  @ViewChild('loadingBar') loadingBar!: ElementRef;
  @Input() width: any;
  @Input() percent!: Observable<number | undefined>;
  outputPercent: any;

  constructor(public addTicketServ: AddTicketService, public fireService: FirestoreService) { }

  ngOnInit(): void {
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.percent.subscribe(p => {this.outputPercent = p?.toFixed(0)})
  }

}
