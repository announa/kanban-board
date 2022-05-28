import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-reauthenticate',
  templateUrl: './reauthenticate.component.html',
  styleUrls: ['./reauthenticate.component.scss']
})
export class ReauthenticateComponent implements OnInit {

  email: string = '';
  password: string = '';
  @Output() onCloseModal = new EventEmitter();
  @Output() onConfirm = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  confirm(){
    this.onConfirm.emit({email: this.email, password: this.password})
    this.closeModal()
  }

  closeModal(){
    this.onCloseModal.emit(true)
  }
}
