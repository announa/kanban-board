import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { threadId } from 'worker_threads';
import { User } from '../models/User.class';
import { AuthenticationService } from '../services/authentication.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-boards-overview',
  templateUrl: './boards-overview.component.html',
  styleUrls: ['./boards-overview.component.scss'],
})
export class BoardsOverviewComponent implements OnInit, OnDestroy {
  showTooltip = false;
  setBgImage = false;
  selectedBoard = '';
  isAddingBoard = false;
  userSubscription!: Subscription;

  constructor(
    public fireService: FirestoreService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  async ngOnInit() {
    console.log('ngOnInit');
    if(await this.authService.loggedInAsGuest()){
      if(this.fireService.currentUser) this.fireService.loadBoards();
      else{
        console.log('else 1');
        await this.fireService.getCurrentUserFromLocalStorage();
        this.fireService.loadBoards();
      } 
    } else if (!this.fireService.currentUser) {
      console.log('subscribe')
      this.userSubscription = this.fireService.currentUser$.subscribe(
        (user) => {
          console.log(user);
          if (user) {
            console.log(user);
            if (this.fireService.currentUser && this.fireService.currentUser.uid != '') {
              this.fireService.loadBoards();
              console.log(this.fireService.currentUser);
            } else {
              this.router.navigateByUrl('/');
            }
          }
        }
      );
    } else {
      console.log('else');
      if (this.fireService.currentUser.uid != '') this.fireService.loadBoards();
      else this.router.navigateByUrl('/');
    }
  }
  /*     this.authService.afAuth.authState.subscribe((user) => {
      if (user) this.fireService.loadBoards();
    }); */
  /* this.fireService.getCurrentUserFromLocalStorage(); */

  /* this.fireService.clearTemp(false); */
  /* this.fireService.loadUserBoards(); */

  ngOnDestroy(): void {
    console.log('ngOnDestroy');
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }

  toggleTooltip() {
    this.showTooltip = !this.showTooltip;
  }

  setBackgroundImage(boardId: string) {
    this.setBgImage = true;
    this.selectedBoard = boardId;
  }
}
