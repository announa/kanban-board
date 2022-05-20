import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { AddTicketService } from '../services/add-ticket.service';
import { AuthenticationService } from '../services/authentication.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit, AfterViewChecked {
  navIsOpen = false;
  navIconClose = false;
  modalIsOpen = false;
  @ViewChild('submenu') submenu!: ElementRef;
  @ViewChild('navLeft') navLeft!: ElementRef;
  @HostListener('window:resize', ['$event'])
  resize() {
    this.resetNav();
  }

  constructor(
    public fireService: FirestoreService,
    public addTicketServ: AddTicketService,
    public authService: AuthenticationService,
    public router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  navigate(url: string) {
    this.toggleMenu();
    this.router.navigateByUrl(url);
  }

  async logout() {
    console.log('logout')
    this.fireService.isProcessing = true;
    await this.fireService.clearData();
    await this.authService.signOut();
  }

  goToLogin() {
    this.router.navigateByUrl('login');
  }

  toggleMenu() {
    this.navIsOpen = !this.navIsOpen;
    setTimeout(() => {
      this.navIconClose = !this.navIconClose;
    }, 200);
  }

  resetNav() {
    if (window.innerWidth >= 700) {
      this.navIsOpen = false;
      this.navIconClose = false;
    }
  }

  isActive(link1: string, link2: string){
    setTimeout(() => {
     return (this.router.isActive(link1 + this.fireService.currentBoard?.id + link2, true))
    }, 5000);
  }

  deleteAccount(){
    this.modalIsOpen = true;
  }
}
