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
import { HttpClient } from '@angular/common/http';


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
  guestData: any;

  constructor(
    private fireService: FirestoreService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fireService.checkForOldGuestData()
  }

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
    this.router.navigateByUrl('/boards');
  }

  rejectLogin(){
    this.alert = true;
    this.fireService.isProcessing = false;
  }

  loginAsGuest(){
    this.fireService.isProcessing = true;
    this.guestData = this.http.get('assets/json/guest.json')
    this.guestData.subscribe(async (guest: any) => {
      await this.fireService.setGuestAccount(guest)
      await this.fireService.setGuestAccountInDb(guest)
      this.loadUserBoards();
      this.fireService.isProcessing = false;
    })
  }
}
