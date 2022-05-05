import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom, Observable, Subscription } from 'rxjs';
import { User } from '../models/User.class';
import { FirestoreService } from '../services/firestore.service';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  userInput = {
    username: '',
    password: '',
  };

  @ViewChild('modal') modal!: ElementRef;
  alert = false;
  guestData: any;
  guestDataSubscription!: Subscription;

  constructor(
    public fireService: FirestoreService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private http: HttpClient,
    public authService: AuthenticationService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.subscribeToCollectios();
    this.fireService.checkForOldGuestData();
  }
  
    ngAfterViewInit() {
      this.cd.detectChanges();
    }

    ngOnDestroy(): void {
      if(this.guestDataSubscription)
      this.guestDataSubscription.unsubscribe()
      this.fireService.userCollectionSubscription.unsubscribe()
    }

  async subscribeToCollectios() {
    await this.fireService.getUserCollection('user');
    await this.fireService.getUserCollection('guest');
  }

/*   async checkLoginData() {
    console.log('logging in ...');
    const matchingUser = this.fireService.checkForMatchingUser(
      this.userInput
    )[0];

    if (matchingUser) {
      this.login(matchingUser);
    } else {
      this.rejectLogin();
    }
  } */

/*   login(matchingUser: User) {
    this.fireService.setCurrentUser(matchingUser);
    this.loadUserBoards();
  } */

  login(email: string, password: string){
    this.authService.signIn(email, password)
  }

  loadUserBoards() {
    this.router.navigateByUrl('/boards');
  }

  rejectLogin() {
    this.alert = true;
    this.fireService.isProcessing = false;
  }

  loginAsGuest() {
    this.fireService.isProcessing = true;
    this.guestData = this.http.get('assets/json/guest.json');
    this.guestDataSubscription = this.guestData.subscribe(async (guest: any) => {
      await this.fireService.setGuestAccount(guest);
      await this.fireService.setGuestAccountInDb(guest);
      this.fireService.isProcessing = false;
      this.loadUserBoards();
    });
  }
}
