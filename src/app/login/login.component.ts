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
import { FirestoreService } from '../services/firestore.service';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  userInput = {
    email: '',
    password: '',
  };
  resetPw = false;

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
    this.fireService.isProcessing = true;
    await this.subscribeToCollectios();
    this.fireService.checkForOldGuestData();
    this.fireService.isProcessing = false;
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

  login(email: string, password: string){
    this.fireService.isProcessing = true;
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
    this.authService.signInAnonymously();
  }
}
