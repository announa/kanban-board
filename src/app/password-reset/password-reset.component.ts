import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

  @Output() onCloseModal = new EventEmitter();
  email: string = '';

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
  }

  resetPw(){
    this.authService.resetPassword(this.email);
    this.closeModal()
  }

  closeModal() {
    this.onCloseModal.emit(true);
  }

}
