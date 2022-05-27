import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
    this.fireService.isProcessing = true;
    this.fireService.currentBoard = undefined;
    if (!this.fireService.currentUser) {
      this.subscribeToUser();
    } else {
      if (this.fireService.currentUser == null)
        this.router.navigateByUrl('login');
      else {
        await this.fireService.loadBoards();
        this.fireService.isProcessing = false;
      }
    }
  }

  subscribeToUser() {
    console.log('subscribe');
    this.userSubscription = this.fireService.currentUser$.subscribe(async (user) => {
      if (user) {
        if (
          this.fireService.currentUser &&
          this.fireService.currentUser.uid != ''
        ) {
          console.log('currentUser loaded');
          await this.fireService.loadBoards();
          this.fireService.isProcessing = false;
        } else {
          console.log('else');
          this.router.navigateByUrl('/login');
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) this.userSubscription.unsubscribe();
    this.fireService.isProcessing = false;
  }

  toggleTooltip() {
    this.showTooltip = !this.showTooltip;
  }

  setBackgroundImage(boardId: string) {
    this.setBgImage = true;
    this.selectedBoard = boardId;
  }
}
