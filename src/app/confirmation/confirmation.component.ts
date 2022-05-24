import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit {
  @Input('text') text: string = '';
  @Input('callback') callback: any;
  @Output() buttonClicked = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  confirm(){
    this.buttonClicked.emit('confirm');
  }

  closeModal() {
    this.buttonClicked.emit('close');
  }
}
