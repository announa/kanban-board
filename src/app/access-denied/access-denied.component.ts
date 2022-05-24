import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.scss']
})
export class AccessDeniedComponent implements OnInit {

  @Input('text') text!: string;
  
  constructor() { }

  ngOnInit(): void {
  }

}
