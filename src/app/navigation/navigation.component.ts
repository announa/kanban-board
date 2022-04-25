import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
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
  @ViewChild('submenu') submenu!: ElementRef;
  @ViewChild('navLeft') navLeft!: ElementRef;
/*   @HostListener('document:click', ['$event'])
  clickEvent(event: any) {
    this.checkIfToggleSubmenu(event);
  } */
  @HostListener('window:resize', ['$event'])
  resize() {
    this.resetNav();
  }

  constructor(
    public fireService: FirestoreService,
    public router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  navigate(url: string) {
    this.toggleMenu();
    this.router.navigateByUrl(url);
  }

  logout() {
    console.log('log out');
    this.fireService.clearData();
    this.navigate('/');
  }

  goToLogin() {
    this.router.navigateByUrl('/');
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
      /* this.submenu.nativeElement.classList.remove('d-unset'); */
      /* this.navLeft.nativeElement.classList.remove('nav-left-open-submenu'); */
    }
  }
/* 
  checkIfToggleSubmenu(event: any) {
    if (
      this.navLeft &&
      event.target != this.navLeft.nativeElement &&
      event.target.parentElement != this.navLeft.nativeElement &&
      event.target.parentElement.parentElement !=
        this.navLeft.nativeElement &&
      event.target.parentElement.parentElement.parentElement !=
        this.navLeft.nativeElement &&
      this.submenu.nativeElement.classList.contains('d-unset')
    ) {
      this.toggleSubmenu();
    }
  }

  toggleSubmenu() {
    if (navigator.maxTouchPoints > 0 && window.innerWidth > 700) {
      this.submenu.nativeElement.classList.toggle('d-unset');
      this.navLeft.nativeElement.classList.toggle('nav-left-open-submenu');
    }
  } */

  isActive(link1: string, link2: string){
    setTimeout(() => {
     return (this.router.isActive(link1 + this.fireService.currentBoard?.id + link2, true))
    }, 5000);
  }
}
