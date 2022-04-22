import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit, AfterViewInit {
  navIsOpen = false;
  navIconClose = false;
  @HostListener('window:resize', ['$event'])
  resize() {
    this.resetNav();
  }

  constructor(
    public fireService: FirestoreService,
    public router: Router,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  logout() {
    console.log('log out');
    this.fireService.clearData();
    this.goToLogin();
  }

  goToLogin() {
    this.router.navigateByUrl('/');
  }

  toggleMenu() {
    this.navIsOpen = !this.navIsOpen;
    setTimeout(() => {
      this.navIconClose = ! this.navIconClose
    }, 200);
  }

  resetNav() {
    if (window.innerWidth >= 700) {
      this.navIsOpen = false;
      this.navIconClose = false;
  }}
}
