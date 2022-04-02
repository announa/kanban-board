import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { User } from '../models/User.class';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  userInput = {
    username: '',
    password: '',
  };

  @ViewChild('modal') modal!: ElementRef;
  width = 0;
  alert = false;

  constructor(
    private fireService: FirestoreService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.width = this.modal.nativeElement.clientWidth;
    this.cd.detectChanges();
  }

  async checkLoginData() {
    console.log('logging in ...');
    const matchingUser = await firstValueFrom(
      this.fireService.checkForMatchingUser(
        this.userInput
      )
    );

    this.fireService.matchingUser = matchingUser[0] as User;

    if (this.fireService.matchingUser) {
      this.login();
    } else{
      this.rejectLogin();
    }
  }

  login(){
    this.fireService.setCurrentUser();
    this.loadUserBoards();
  }

  loadUserBoards() {
    console.log(this.fireService.currentUser)
    this.router.navigateByUrl('/boards');
  }

  rejectLogin(){
    this.alert = true;
    this.fireService.isProcessing = false;
  }
}
