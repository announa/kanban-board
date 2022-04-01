import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AddTicketService } from '../services/add-ticket.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss']
})
export class LoadingBarComponent implements OnInit {
  @ViewChild('loadingBar') loadingBar!: ElementRef;
  @Input() width: any

  constructor(public addTicketServ: AddTicketService, public fireService: FirestoreService) { }

  ngOnInit(): void {
  }

}
