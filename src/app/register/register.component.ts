import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/User.class';
import { AuthenticationService } from '../services/authentication.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  newUser = {email: '', password: ''};
  passwordConfirmation!: string;
  alert = '';
  existingUser!: User;
  acceptPrivacy = false;
  showPrivacy = false;

  @ViewChild('modal') modal!: ElementRef;

  constructor(
    public fireService: FirestoreService,
    private router: Router,
    public authService: AuthenticationService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  hideAlert() {
    this.alert = '';
  }

  register(){
    if (this.passwordCheck() === true) {

    this.authService.signUp(this.newUser.email, this.newUser.password)
  }
  }

  passwordCheck() {
    return this.newUser.password === this.passwordConfirmation;
  }
}