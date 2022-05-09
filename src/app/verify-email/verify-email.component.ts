import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  @Output() onCloseModal = new EventEmitter();


  constructor(public authService: AuthenticationService) { }

  ngOnInit(): void {
  }

  closeModal() {
    this.onCloseModal.emit(true);
  }


}
